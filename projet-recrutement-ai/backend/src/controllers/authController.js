import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

/**
 * Controller 1: Better Auth Handlers (Sign-up, Sign-in, Sign-out, etc.)
 */
export const handleAuth = toNodeHandler(auth);

/**
 * Controller 2: Dashboard Controller
 */
export const getDashboardData = async (req, res) => {
    try {
        // 'req.user' comes from the middleware (protectDashboard) which checked the session
        const currentUser = req.user;

        // Here you can add any logic you want (like fetching products, user stats from the database with Prisma)
        res.status(200).json({
            success: true,
            message: "Welcome to your dashboard safely!",
            data: {
                username: currentUser.name,
                email: currentUser.email,
                role: "Admin",
                serverTime: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
};