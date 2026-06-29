import { auth } from "../lib/auth.js";

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