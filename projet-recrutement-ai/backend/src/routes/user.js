import { Router } from "express";
import prisma from "../config/db.js";

const router = Router();

router.patch("/api/user/update-role", async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({ error: "Missing userId or role" });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role, isOnboarded: true },
        });

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
