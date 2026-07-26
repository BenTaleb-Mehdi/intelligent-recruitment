import { auth } from "../lib/auth.js";

/**
 * Ensures the requesting user is authenticated via Better Auth or N8N API Key.
 */
export const requireAuth = async (req, res, next) => {
    try {
        // Allow N8N API Key access if configured via environment header
        const n8nHeaderKey = req.headers["x-n8n-api-key"] || req.headers["x-api-key"];
        const expectedApiKey = process.env.N8N_API_KEY || "recrutement_n8n_secret_key";
        if (n8nHeaderKey && n8nHeaderKey === expectedApiKey) {
            req.isN8n = true;
            return next();
        }

        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "You are not logged in. Please log in first.",
            });
        }

        req.user = session.user;
        req.session = session.session;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message,
        });
    }
};

/**
 * Checks authorization to view/download/delete a candidate's CV.
 * Rules:
 * - Candidate can only access their own CV.
 * - Recruiter can access CVs of candidates.
 * - Admin can access any CV.
 * - N8N requests with valid API key have stream access.
 */
export const authorizeCvAccess = (req, res, next) => {
    if (req.isN8n) {
        return next();
    }

    const currentUser = req.user;
    const targetUserId = req.params.userId || req.body?.userId;

    if (!currentUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: "Authentication required.",
        });
    }

    const role = currentUser.role ? currentUser.role.toUpperCase() : "CANDIDATE";

    if (role === "ADMIN") {
        return next();
    }

    if (role === "RECRUITER") {
        return next();
    }

    // Candidate can only access their own CV
    if (currentUser.id === targetUserId) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Forbidden",
        error: "You are not authorized to access this CV.",
    });
};
