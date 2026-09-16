import { auth } from "../lib/auth.js";
import prisma from "../config/db.js";
import Message from "../models/Message.js";

export const protectDashboard = async (req, res, next) => {
    try {
        // Better Auth API checks the headers automatically to see who is logged in
        const session = await auth.api.getSession({
            headers: req.headers
        });

        // If there is no session, the user is not logged in -> 401 Unauthorized
        if (!session) {
            return res.status(401).json({ 
                success: false, 
                message: "You are not logged in, please login first!" 
            });
        }

        // If the session is working, we store the information in 'req.user' to use it in the controller
        req.user = session.user;
        req.session = session.session;

        // Pass to the next step (the controller)
        next();
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Error checking the session", 
            error: error.message 
        });
    }
};

/**
 * Allow admins to manage any offer, but restrict recruiters to offers owned
 * by their own recruiter profile. This check must run on every mutation.
 */
export const requireJobOfferOwnerOrAdmin = async (req, res, next) => {
    try {
        const role = String(req.user?.role || "").toUpperCase();
        if (role === "ADMIN") return next();

        const offer = await prisma.jobOffer.findUnique({
            where: { id: req.params.id },
            select: { recruiter: { select: { id: true, userId: true } } },
        });

        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }

        if (offer.recruiter.userId !== req.user?.id) {
            return res.status(403).json({ success: false, error: "You do not own this job offer" });
        }

        req.recruiter = offer.recruiter;
        next();
    } catch (error) {
        console.error("Error checking job offer ownership:", error);
        return res.status(500).json({ success: false, error: "Error checking job offer ownership" });
    }
};

const canAccessApplication = (application, user) => {
    const role = String(user?.role || "").toUpperCase();
    if (role === "ADMIN") return true;
    return application?.candidate?.userId === user?.id
        || application?.jobOffer?.recruiter?.userId === user?.id;
};

export const requireApplicationParticipant = async (req, res, next) => {
    try {
        const applicationId = req.params.applicationId || req.body?.applicationId;
        if (!applicationId) {
            return res.status(400).json({ success: false, error: "Application ID is required" });
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: {
                id: true,
                candidate: { select: { userId: true } },
                jobOffer: { select: { recruiter: { select: { userId: true } } } },
            },
        });

        if (!application) {
            return res.status(404).json({ success: false, error: "Application not found" });
        }
        if (!canAccessApplication(application, req.user)) {
            return res.status(403).json({ success: false, error: "You cannot access this conversation" });
        }

        req.application = application;
        next();
    } catch (error) {
        console.error("Error checking application access:", error);
        return res.status(500).json({ success: false, error: "Error checking application access" });
    }
};

export const requireMessageParticipant = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.messageId).lean();
        if (!message) {
            return res.status(404).json({ success: false, error: "Message not found" });
        }

        const application = await prisma.application.findUnique({
            where: { id: message.applicationId },
            select: {
                id: true,
                candidate: { select: { userId: true } },
                jobOffer: { select: { recruiter: { select: { userId: true } } } },
            },
        });

        if (!canAccessApplication(application, req.user)) {
            return res.status(403).json({ success: false, error: "You cannot access this message" });
        }

        req.message = message;
        next();
    } catch (error) {
        console.error("Error checking message access:", error);
        return res.status(500).json({ success: false, error: "Error checking message access" });
    }
};
