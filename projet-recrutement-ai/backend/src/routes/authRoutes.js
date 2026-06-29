import express from "express";
import { handleAuth, getDashboardData } from "../controllers/authController.js";
import { protectDashboard } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. All Better Auth endpoints (api/auth/sign-in, api/auth/sign-up...) 
// must go through this path and the handleAuth controller will handle them.
router.all("/auth/*splat", handleAuth);

// 2. The dashboard path is protected by the middleware. 
// The user will go through protectDashboard first, if it succeeds, they will see getDashboardData
router.get("/dashboard", protectDashboard, getDashboardData);

export default router;