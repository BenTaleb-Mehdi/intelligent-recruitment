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
      pendingReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.user.count({ where: { role: "RECRUITER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { isOnboarded: true } }),
      prisma.jobOffer.count(),
      prisma.application.count(),
      prisma.testResult.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);

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

export async function getAdminUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        isOnboarded: true,
        createdAt: true,
        image: true,
        candidate: {
          select: {
            id: true,
            title: true,
            phone: true,
            location: true,
            status: true,
            employabilityScore: true,
            _count: { select: { applications: true, testResults: true } },
          },
        },
        recruiter: {
          select: {
            id: true,
            companyName: true,
            industry: true,
            headquarters: true,
            verificationStatus: true,
            _count: { select: { jobOffers: true } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getAdminUser error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
}

const QUIZ_STATUSES = new Set(["PENDING", "VALIDATED", "REJECTED"]);

export async function getAdminQuizzes(req, res) {
  try {
    const search = String(req.query.search || "").trim();
    const requestedStatus = String(req.query.status || "").toUpperCase();
    const status = QUIZ_STATUSES.has(requestedStatus) ? requestedStatus : undefined;

    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { jobOffer: { title: { contains: search } } },
                { jobOffer: { recruiter: { companyName: { contains: search } } } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        jobOffer: {
          select: {
            id: true,
            title: true,
            recruiter: { select: { id: true, companyName: true } },
          },
        },
        _count: { select: { questions: true, testResults: true } },
        testResults: { select: { score: true } },
      },
    });

    const data = quizzes.map(({ testResults, ...quiz }) => ({
      ...quiz,
      averageScore: testResults.length
        ? Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
        : null,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("getAdminQuizzes error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
  }
}

export async function getAdminQuizResults(req, res) {
  try {
    const results = await prisma.testResult.findMany({
      orderBy: { completedAt: "desc" },
      include: {
        candidate: {
          select: {
            id: true,
            title: true,
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            _count: { select: { questions: true } },
            jobOffer: {
              select: {
                id: true,
                title: true,
                recruiter: { select: { id: true, companyName: true } },
              },
            },
          },
        },
      },
    });

    res.json({ success: true, data: results });
  } catch (error) {
    console.error("getAdminQuizResults error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch quiz results" });
  }
}

export async function getAdminQuizResult(req, res) {
  try {
    const result = await prisma.testResult.findUnique({
      where: { id: req.params.id },
      include: {
        candidate: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            skills: { select: { id: true, name: true } },
          },
        },
        quiz: {
          include: {
            questions: { orderBy: { id: "asc" } },
            jobOffer: {
              include: {
                recruiter: {
                  select: {
                    id: true,
                    companyName: true,
                    user: { select: { id: true, name: true, email: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Quiz result not found" });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("getAdminQuizResult error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch quiz result" });
  }
}

export async function updateAdminQuizStatus(req, res) {
  try {
    const status = String(req.body.status || "").toUpperCase();
    if (!QUIZ_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be PENDING, VALIDATED, or REJECTED",
      });
    }

    const quiz = await prisma.quiz.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        jobOffer: {
          select: {
            id: true,
            title: true,
            recruiter: { select: { id: true, companyName: true } },
          },
        },
        _count: { select: { questions: true, testResults: true } },
      },
    });

    res.json({ success: true, data: quiz });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    console.error("updateAdminQuizStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update quiz status" });
  }
}
