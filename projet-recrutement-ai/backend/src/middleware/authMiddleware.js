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

        // 1. Try finding by Application.id
        let application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: {
                id: true,
                candidate: { select: { userId: true, id: true } },
                jobOffer: { select: { recruiter: { select: { userId: true, id: true } } } },
            },
        });

        // 2. If not found, try finding by candidateId or candidate userId
        if (!application) {
            application = await prisma.application.findFirst({
                where: {
                    OR: [
                        { candidateId: applicationId },
                        { candidate: { userId: applicationId } },
                        { candidate: { id: applicationId } },
                    ],
                },
                select: {
                    id: true,
                    candidate: { select: { userId: true, id: true } },
                    jobOffer: { select: { recruiter: { select: { userId: true, id: true } } } },
                },
                orderBy: { appliedDate: "desc" },
            });
        }

        // 3. If still not found and user is a recruiter, find or create application with one of recruiter's offers
        if (!application && req.user?.role === "RECRUITER") {
            const candidate = await prisma.candidate.findFirst({
                where: {
                    OR: [
                        { id: applicationId },
                        { userId: applicationId },
                    ],
                },
                select: { id: true, userId: true },
            });

            if (candidate) {
                const jobOffer = await prisma.jobOffer.findFirst({
                    where: { recruiter: { userId: req.user.id } },
                    orderBy: { createdAt: "desc" },
                    select: { id: true, recruiter: { select: { userId: true, id: true } } },
                });

                if (jobOffer) {
                    try {
                        application = await prisma.application.create({
                            data: {
                                candidateId: candidate.id,
                                jobOfferId: jobOffer.id,
                                status: "NEW",
                                matchScore: 75,
                            },
                            select: {
                                id: true,
                                candidate: { select: { userId: true, id: true } },
                                jobOffer: { select: { recruiter: { select: { userId: true, id: true } } } },
                            },
                        });
                    } catch (e) {
                        // ignore create collision
                    }
                }
            }
        }

        if (application) {
            if (!canAccessApplication(application, req.user)) {
                return res.status(403).json({ success: false, error: "You cannot access this conversation" });
            }
            req.application = application;
            return next();
        }

        // Fallback: If authenticated as recruiter or candidate, allow message flow
        if (req.user?.role === "RECRUITER" || req.user?.role === "CANDIDATE" || req.user?.role === "ADMIN") {
            return next();
        }

        return res.status(404).json({ success: false, error: "Application not found" });
    } catch (error) {
        console.error("Error checking application access:", error);
        if (req.user) {
            return next();
        }
        return res.status(500).json({ success: false, error: "Error checking application access" });
    }
};

export const requireMessageParticipant = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.messageId).lean();
        if (!message) {
            return res.status(404).json({ success: false, error: "Message not found" });
        }

        if (message.senderId === req.user?.id) {
            req.message = message;
            return next();
        }

        const application = await prisma.application.findFirst({
            where: {
                OR: [
                    { id: message.applicationId },
                    { candidateId: message.applicationId },
                    { candidate: { userId: message.applicationId } },
                ],
            },
            select: {
                id: true,
                candidate: { select: { userId: true } },
                jobOffer: { select: { recruiter: { select: { userId: true } } } },
            },
        });

        if (application && !canAccessApplication(application, req.user)) {
            return res.status(403).json({ success: false, error: "You cannot access this message" });
        }

        req.message = message;
        next();
    } catch (error) {
        console.error("Error checking message access:", error);
        if (req.user) {
            return next();
        }
        return res.status(500).json({ success: false, error: "Error checking message access" });
    }
};
