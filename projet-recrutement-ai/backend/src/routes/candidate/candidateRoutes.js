import { Router } from "express";
import * as profileController from "../../controllers/candidate/profileController.js";
import * as applicationController from "../../controllers/candidate/applicationController.js";
import * as quizController from "../../controllers/candidate/quizController.js";
import { protectDashboard } from "../../middleware/authMiddleware.js";

const router = Router();

// Profile operations
router.get("/api/candidates/profile", protectDashboard, profileController.getCandidateProfile);
router.put("/api/candidates/profile", protectDashboard, profileController.updateCandidateProfile);

// Applications operations
router.get("/api/candidates/applications", protectDashboard, applicationController.getCandidateApplications);
router.post("/api/candidates/applications", protectDashboard, applicationController.applyToJob);
router.delete("/api/candidates/applications/:id", protectDashboard, applicationController.cancelApplication);

// Quizzes operations
router.get("/api/candidates/quizzes", protectDashboard, quizController.getCandidateQuizzes);
router.post("/api/candidates/quizzes/:id/submit", protectDashboard, quizController.submitQuizResult);

export default router;
