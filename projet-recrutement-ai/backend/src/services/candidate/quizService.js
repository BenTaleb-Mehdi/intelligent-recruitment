import prisma from "../../config/db.js";

/**
 * Fetch quizzes for candidate
 */
export const getCandidateQuizzes = async (candidateId) => {
    const applications = await prisma.application.findMany({
        where: { candidateId },
        select: { jobOfferId: true },
    });

    const jobOfferIds = applications.map((a) => a.jobOfferId);

    return prisma.quiz.findMany({
        where: {
            jobOfferId: { in: jobOfferIds },
            status: "VALIDATED",
        },
        include: {
            jobOffer: {
                select: {
                    id: true,
                    title: true,
                    recruiter: { select: { companyName: true } },
                },
            },
            questions: true,
            testResults: {
                where: { candidateId },
            },
        },
    });
};

/**
 * Submit quiz assessment score
 */
export const submitQuizResult = async (candidateId, quizId, score) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
    });

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    const passed = score >= 70; // 70% passing threshold

    return prisma.testResult.create({
        data: {
            candidateId,
            quizId,
            score,
            passed,
        },
    });
};
