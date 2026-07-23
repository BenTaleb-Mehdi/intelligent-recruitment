import { Router } from "express";
import * as recruiterController from "../../controllers/recruiter/recruiterController.js";
import { getRecruiterStats, getRecentApplications } from "../../services/statsService.js";
import { protectDashboard } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/api/recruiters", recruiterController.getAllRecruiters);
router.get("/api/recruiters/:id", recruiterController.getRecruiterById);
router.get("/api/recruiters/:recruiterId/stats", async (req, res) => {
    try {
        const stats = await getRecruiterStats(req.params.recruiterId);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
router.get("/api/recruiters/:recruiterId/recent-applications", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const applications = await getRecentApplications(req.params.recruiterId, limit);
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error fetching recent applications:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
router.post("/api/recruiters", protectDashboard, recruiterController.createRecruiter);
router.put("/api/recruiters/:id", protectDashboard, recruiterController.updateRecruiter);
router.delete("/api/recruiters/:id", protectDashboard, recruiterController.deleteRecruiter);

export default router;
