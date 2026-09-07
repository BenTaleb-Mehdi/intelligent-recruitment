import { Router } from "express";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  getAdminQuizResult,
  getAdminQuizResults,
  getAdminQuizzes,
  getAdminStats,
  getAdminUsers,
  updateAdminQuizStatus,
} from "../controllers/adminController.js";

const router = Router();

router.get("/stats", requireAdmin, getAdminStats);
router.get("/users", requireAdmin, getAdminUsers);
router.get("/quizzes", requireAdmin, getAdminQuizzes);
router.patch("/quizzes/:id/status", requireAdmin, updateAdminQuizStatus);
router.get("/quiz-results", requireAdmin, getAdminQuizResults);
router.get("/quiz-results/:id", requireAdmin, getAdminQuizResult);

export default router;
