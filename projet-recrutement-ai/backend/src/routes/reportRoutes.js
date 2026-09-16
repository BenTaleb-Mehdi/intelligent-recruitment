import { Router } from "express";
import { protectDashboard } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { createReport, getAdminReports, updateAdminReportStatus } from "../controllers/reportController.js";

const router = Router();

router.post("/api/reports", protectDashboard, createReport);
router.get("/api/admin/reports", requireAdmin, getAdminReports);
router.patch("/api/admin/reports/:id/status", requireAdmin, updateAdminReportStatus);

export default router;
