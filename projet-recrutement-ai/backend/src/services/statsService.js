import prisma from "../config/db.js";

export const getRecruiterStats = async (recruiterId) => {
    const jobOffers = await prisma.jobOffer.findMany({
        where: { recruiterId },
        select: { id: true, status: true },
    });

    const jobOfferIds = jobOffers.map((o) => o.id);

    const applications = await prisma.application.findMany({
        where: { jobOfferId: { in: jobOfferIds } },
        select: { id: true, status: true, matchScore: true },
    });

    const totalApps = applications.length;
    const openJobs = jobOffers.filter((o) => o.status === "OPEN").length;
    const interviewCount = applications.filter((a) => a.status === "INTERVIEW").length;
    const avgScore = totalApps > 0
        ? Math.round(applications.reduce((sum, a) => sum + a.matchScore, 0) / totalApps)
        : 0;

    return {
        totalJobOffers: jobOffers.length,
        openJobs,
        totalApplications: totalApps,
        interviewCount,
        avgMatchScore: avgScore,
    };
};

export const getRecentApplications = async (recruiterId, limit = 10) => {
    const jobOffers = await prisma.jobOffer.findMany({
        where: { recruiterId },
        select: { id: true },
    });

    const jobOfferIds = jobOffers.map((o) => o.id);

    return prisma.application.findMany({
        where: { jobOfferId: { in: jobOfferIds } },
        include: {
            candidate: {
                include: { user: { select: { id: true, name: true, email: true, image: true } } },
            },
            jobOffer: { select: { id: true, title: true } },
        },
        orderBy: { appliedDate: "desc" },
        take: limit,
    });
};
