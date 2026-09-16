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
        select: {
            id: true,
            status: true,
            jobOffer: {
                select: {
                    applications: {
                        where: { candidateId },
                        select: { id: true },
                    },
                },
            },
        },
    });

    if (!quiz) {
        const error = new Error("Quiz not found");
        error.statusCode = 404;
        throw error;
    }

    if (quiz.status !== "VALIDATED") {
        const error = new Error("This quiz is not available for submission");
        error.statusCode = 403;
        throw error;
    }

    if (quiz.jobOffer.applications.length === 0) {
        const error = new Error("You are not eligible for this quiz");
        error.statusCode = 403;
        throw error;
    }

    const normalizedScore = Number(score);
    if (!Number.isInteger(normalizedScore) || normalizedScore < 0 || normalizedScore > 100) {
        const error = new Error("Score must be an integer between 0 and 100");
        error.statusCode = 400;
        throw error;
    }

    const existingResult = await prisma.testResult.findFirst({
        where: { candidateId, quizId },
        select: { id: true },
    });
    if (existingResult) {
        const error = new Error("This quiz has already been submitted");
        error.statusCode = 409;
        throw error;
    }

    const passed = normalizedScore >= 70; // 70% passing threshold

    return prisma.testResult.create({
        data: {
            candidateId,
            quizId,
            score: normalizedScore,
            passed,
        },
    });
};
