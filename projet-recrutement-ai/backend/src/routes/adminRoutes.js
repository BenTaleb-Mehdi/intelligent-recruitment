import { Router } from "express";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { getAdminStats, getAdminUsers } from "../controllers/adminController.js";

const router = Router();

router.get("/stats", requireAdmin, getAdminStats);
router.get("/users", requireAdmin, getAdminUsers);

export default router;
