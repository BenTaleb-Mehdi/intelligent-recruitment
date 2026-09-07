import prisma from "../config/db.js";

const toNotification = ({ id, type, title, description, createdAt, unread, href }) => ({
  id: `${type}-${id}`,
  type,
  title,
  description,
  createdAt,
  unread,
  href,
});

export async function getAdminNotifications(req, res) {
  try {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [reports, quizzes, jobs] = await Promise.all([
      prisma.report.findMany({
        where: { status: { in: ["PENDING", "REVIEWING"] } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          reportedUser: { select: { name: true } },
          reporterUser: { select: { name: true } },
        },
      }),
      prisma.quiz.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          createdAt: true,
          jobOffer: { select: { title: true } },
        },
      }),
      prisma.jobOffer.findMany({
        where: { createdAt: { gte: dayAgo } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, createdAt: true },
      }),
    ]);

    const notifications = [
      ...reports.map((report) => toNotification({
        id: report.id,
        type: "report",
        title: "User report requires attention",
        description: `${report.reporterUser.name} reported ${report.reportedUser.name}: ${report.reason}`,
        createdAt: report.createdAt,
        unread: report.status === "PENDING",
        href: "/admin/reported",
      })),
      ...quizzes.map((quiz) => toNotification({
        id: quiz.id,
        type: "quiz",
        title: "Quiz waiting for review",
        description: `${quiz.title} for ${quiz.jobOffer.title}`,
        createdAt: quiz.createdAt,
        unread: true,
        href: "/admin/quizzes",
      })),
      ...jobs.map((job) => toNotification({
        id: job.id,
        type: "job",
        title: "New job offer published",
        description: job.title,
        createdAt: job.createdAt,
        unread: true,
        href: "/admin/jobs",
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({ success: true, data: notifications.slice(0, 20) });
  } catch (error) {
    console.error("getAdminNotifications error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
}
