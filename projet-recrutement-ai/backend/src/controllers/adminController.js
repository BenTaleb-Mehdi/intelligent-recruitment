import prisma from "../config/db.js";

export async function getAdminStats(req, res) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      totalUsers,
      candidats,
      recruteurs,
      admins,
      newThisWeek,
      verifiedEmails,
      onboardedUsers,
      jobOffers,
      applications,
      quizResults,
    ] = await Promise.all([
      prisma.user.count(),
      // Role enum values are CANDIDATE / RECRUITER / ADMIN (uppercase)
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.user.count({ where: { role: "RECRUITER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { isOnboarded: true } }),
      prisma.jobOffer.count(),
      prisma.application.count(),
      prisma.testResult.count(),
    ]);

    // pendingReports: no Report model yet — return 0 until Sprint 4
    const pendingReports = 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        candidats,
        recruteurs,
        admins,
        newThisWeek,
        verifiedEmails,
        onboardedUsers,
        pendingReports,
        jobOffers,
        applications,
        quizResults,
      },
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
}

export async function getAdminUsers(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = (req.query.search || "").trim();
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { id: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          role: true,
          isOnboarded: true,
          createdAt: true,
          image: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("getAdminUsers error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
}
