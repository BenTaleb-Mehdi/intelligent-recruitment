import express from "express";
import { getDashboardData } from "../controllers/authController.js";
import { protectDashboard } from "../middleware/authMiddleware.js";

const router = express.Router();

// The dashboard path is protected by the middleware. 
// The user will go through protectDashboard first, if it succeeds, they will see getDashboardData
router.get("/dashboard", protectDashboard, getDashboardData);

export default router;