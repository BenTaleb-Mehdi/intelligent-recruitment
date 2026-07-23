import prisma from "../../config/db.js";

/**
 * Fetch all applications submitted by candidate
 */
export const getCandidateApplications = async (candidateId) => {
    return prisma.application.findMany({
        where: { candidateId },
        include: {
            jobOffer: {
                include: {
                    recruiter: { select: { id: true, companyName: true } },
                    skills: { select: { id: true, name: true } },
                },
            },
        },
        orderBy: { appliedDate: "desc" },
    });
};

/**
 * Apply to a job offer
 */
export const applyToJob = async (candidateId, jobOfferId) => {
    const existing = await prisma.application.findFirst({
        where: { candidateId, jobOfferId },
    });

    if (existing) {
        throw new Error("You have already applied to this job");
    }

    // Mock an AI match score between 70 and 99
    const matchScore = Math.floor(Math.random() * 30) + 70;

    return prisma.application.create({
        data: {
            candidateId,
            jobOfferId,
            status: "NEW",
            matchScore,
            matchExplanation: "Automatically matched based on profile skills.",
        },
        include: {
            jobOffer: true,
        },
    });
};

/**
 * Cancel/withdraw a job application
 */
export const cancelApplication = async (candidateId, applicationId) => {
    return prisma.application.delete({
        where: {
            id: applicationId,
            candidateId,
        },
    });
};
