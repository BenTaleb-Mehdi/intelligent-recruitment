import prisma from "../config/db.js";

const REPORT_STATUSES = new Set(["PENDING", "REVIEWING", "RESOLVED", "DISMISSED"]);
const REPORT_SEVERITIES = new Set(["LOW", "MEDIUM", "HIGH"]);

const reportInclude = {
    reportedUser: { select: { id: true, name: true, email: true, role: true, image: true } },
    reporterUser: { select: { id: true, name: true, email: true, role: true, image: true } },
    resolvedBy: { select: { id: true, name: true, email: true } },
};

export async function createReport(req, res) {
    try {
        const reporterUserId = req.user?.id;
        const reporterRole = String(req.user?.role || "").toUpperCase();
        const { reportedUserId, reason } = req.body;
        const severity = String(req.body.severity || "MEDIUM").toUpperCase();

        if (reporterRole !== "CANDIDATE" && reporterRole !== "RECRUITER") {
            return res.status(403).json({ success: false, message: "Only candidates and recruiters can submit reports" });
        }
        if (!reportedUserId || !String(reason || "").trim()) {
            return res.status(400).json({ success: false, message: "reportedUserId and reason are required" });
        }
        if (reportedUserId === reporterUserId) {
            return res.status(400).json({ success: false, message: "You cannot report yourself" });
        }
        if (!REPORT_SEVERITIES.has(severity)) {
            return res.status(400).json({ success: false, message: "Invalid report severity" });
        }

        const reportedUser = await prisma.user.findUnique({
            where: { id: reportedUserId },
            select: { id: true },
        });
        if (!reportedUser) {
            return res.status(404).json({ success: false, message: "Reported user not found" });
        }

        const existing = await prisma.report.findFirst({
            where: {
                reporterUserId,
                reportedUserId,
                status: { in: ["PENDING", "REVIEWING"] },
            },
            select: { id: true },
        });
        if (existing) {
            return res.status(409).json({ success: false, message: "You already have an active report for this user" });
        }

        const report = await prisma.report.create({
            data: {
                reporterUserId,
                reportedUserId,
                reason: String(reason).trim(),
                severity,
            },
            include: reportInclude,
        });

        // Notify connected administrators without exposing report details over Socket.IO.
        req.app.get("io")?.to("admins").emit("admin_notification", {
            type: "report",
            id: report.id,
        });

        return res.status(201).json({ success: true, data: report });
    } catch (error) {
        console.error("createReport error:", error);
        return res.status(500).json({ success: false, message: "Failed to submit report" });
    }
}

export async function getAdminReports(req, res) {
    try {
        const requestedStatus = String(req.query.status || "").toUpperCase();
        const status = REPORT_STATUSES.has(requestedStatus) ? requestedStatus : undefined;
        const reports = await prisma.report.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: "desc" },
            include: reportInclude,
        });

        return res.json({ success: true, data: reports });
    } catch (error) {
        console.error("getAdminReports error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch reports" });
    }
}

export async function updateAdminReportStatus(req, res) {
    try {
        const status = String(req.body.status || "").toUpperCase();
        if (!REPORT_STATUSES.has(status)) {
            return res.status(400).json({ success: false, message: "Invalid report status" });
        }

        const report = await prisma.report.update({
            where: { id: req.params.id },
            data: {
                status,
                resolvedAt: status === "RESOLVED" || status === "DISMISSED" ? new Date() : null,
                resolvedById: status === "RESOLVED" || status === "DISMISSED" ? req.user.id : null,
            },
            include: reportInclude,
        });

        return res.json({ success: true, data: report });
    } catch (error) {
        if (error?.code === "P2025") {
            return res.status(404).json({ success: false, message: "Report not found" });
        }
        console.error("updateAdminReportStatus error:", error);
        return res.status(500).json({ success: false, message: "Failed to update report" });
    }
}
