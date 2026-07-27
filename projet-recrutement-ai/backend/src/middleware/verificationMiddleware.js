import prisma from "../config/db.js";

/**
 * Middleware to enforce company verification before allowing job creation.
 * Checks if the logged-in user has a recruiter record with verificationStatus === 'VERIFIED'.
 */
export const requireVerifiedRecruiter = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User session not found.",
            });
        }

        // Query the recruiters table for this user with fallback to raw query
        let recruiter = null;
        try {
            recruiter = await prisma.recruiter.findUnique({
                where: { userId },
                select: { id: true, verificationStatus: true },
            });
        } catch {
            const raw = await prisma.$queryRawUnsafe(
                `SELECT id, verification_status AS verificationStatus FROM recruiter WHERE userId = ?`,
                userId
            );
            if (Array.isArray(raw) && raw.length > 0) {
                recruiter = raw[0];
            }
        }

        // If verification status is NOT 'VERIFIED', abort with 403 Forbidden
        if (!recruiter || recruiter.verificationStatus !== "VERIFIED") {
            return res.status(403).json({
                success: false,
                code: "COMPANY_NOT_VERIFIED",
                canCreateOffer: false,
                message: "You can't create a job offer yet. Please go to Settings to verify your company's ICE or RC.",
                redirectTo: "/recruiter/settings"
            });
        }

        // Attach recruiter info to request
        req.recruiter = recruiter;

        next();
    } catch (error) {
        console.error("Error in requireVerifiedRecruiter middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error checking recruiter verification status.",
            error: error.message,
        });
    }
};
