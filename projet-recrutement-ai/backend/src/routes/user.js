import { Router } from "express";
import prisma from "../config/db.js";
import { protectDashboard } from "../middleware/authMiddleware.js";

const router = Router();

router.patch("/api/user/update-role", protectDashboard, async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user?.id;
        if (!userId || !role) {
            return res.status(400).json({ error: "Missing role" });
        }

        const ROLE_MAP = {
            candidat: "CANDIDATE",
            candidate: "CANDIDATE",
            recruteur: "RECRUITER",
            recruiter: "RECRUITER",
        };

        const normalizedRole = ROLE_MAP[String(role).toLowerCase()];
        if (!normalizedRole) {
            return res.status(400).json({ error: "Invalid role" });
        }

        // Role selection is only for onboarding. Admin privileges are granted
        // through a controlled server-side process, never through this endpoint.
        if (req.user.role && String(req.user.role).toUpperCase() === "ADMIN") {
            return res.status(403).json({ error: "Admin role cannot be changed here" });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: normalizedRole, isOnboarded: true },
        });

        if (normalizedRole === "CANDIDATE") {
            const existing = await prisma.candidate.findUnique({ where: { userId } });
            if (!existing) {
                await prisma.candidate.create({
                    data: { userId, title: "Developer" },
                });
            }
        }

        if (normalizedRole === "RECRUITER") {
            const existing = await prisma.recruiter.findUnique({ where: { userId } });
            if (!existing) {
                await prisma.recruiter.create({
                    data: { userId },
                });
            }
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
