import { Router } from "express";
import prisma from "../config/db.js";

const router = Router();

router.patch("/api/user/update-role", async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({ error: "Missing userId or role" });
        }

        const ROLE_MAP = {
            candidat: "CANDIDATE",
            candidate: "CANDIDATE",
            recruteur: "RECRUITER",
            recruiter: "RECRUITER",
            admin: "ADMIN",
        };

        const normalizedRole = ROLE_MAP[role] || role.toUpperCase();

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
