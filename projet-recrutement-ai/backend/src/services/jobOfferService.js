import prisma from "../config/db.js";

export const getAllJobOffers = async (filters = {}) => {
    const where = {};

    if (filters.recruiterId) where.recruiterId = filters.recruiterId;
    if (filters.status) where.status = filters.status;
    if (filters.location) where.location = { contains: filters.location };
    if (filters.contractType) where.contractType = filters.contractType;

    return prisma.jobOffer.findMany({
        where,
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
            _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getJobOfferById = async (id) => {
    return prisma.jobOffer.findUnique({
        where: { id },
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
            applications: true,
            quiz: {
                include: {
                    questions: true,
                },
            },
        },
    });
};

export const getJobOffersByRecruiterId = async (recruiterId) => {
    return prisma.jobOffer.findMany({
        where: { recruiterId },
        include: {
            skills: { select: { id: true, name: true } },
            _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const triggerN8NWebhook = async (offer) => {
    // Map fields to match n8n payload structure (id, title, contractType, location, skills)
    const payload = {
        id: offer.id,
        title: offer.title,
        contractType: offer.contractType,
        location: offer.location || "",
        skills: offer.skills ? offer.skills.map((s) => s.name).join(", ") : "",
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            console.log("🚀 Sending request to n8n URL:", webhookUrl);
            console.log("📦 Payload sent to n8n:", payload);

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = await response.text();
                }
                const error = new Error(typeof errorData === "string" ? errorData : JSON.stringify(errorData));
                error.response = { data: errorData };
                throw error;
            }

            const responseData = await response.json();
            console.log("✅ n8n response:", responseData);
        } catch (error) {
            console.error("❌ Failed to call n8n:", error.response?.data || error.message);
        }
    } else {
        console.warn("⚠️ N8N_WEBHOOK_URL is not defined in the environment variables.");
    }
};

export const createJobOffer = async (data) => {
    const offer = await prisma.jobOffer.create({
        data,
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
        },
    });

    await triggerN8NWebhook(offer);

    return offer;
};

export const updateJobOffer = async (id, data, triggerWebhook = true) => {
    const offer = await prisma.jobOffer.update({
        where: { id },
        data,
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
        },
    });

    if (triggerWebhook) {
        await triggerN8NWebhook(offer);
    }

    return offer;
};

export const deleteJobOffer = async (id) => {
    return prisma.jobOffer.delete({ where: { id } });
};

export const toggleJobOfferStatus = async (id) => {
    const offer = await prisma.jobOffer.findUnique({ where: { id } });
    if (!offer) return null;

    const updatedOffer = await prisma.jobOffer.update({
        where: { id },
        data: { status: offer.status === "OPEN" ? "CLOSED" : "OPEN" },
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
        },
    });

    await triggerN8NWebhook(updatedOffer);

    return updatedOffer;
};

export const updateJobOfferDescriptionAndQuiz = async (id, description, quizData) => {
    // Fetch the job offer to verify it exists and get its title
    const jobOffer = await prisma.jobOffer.findUnique({
        where: { id },
        select: { title: true },
    });

    if (!jobOffer) return null;

    const updateData = {};
    if (description !== undefined) {
        updateData.description = description;
    }

    if (quizData && Array.isArray(quizData.questions) && quizData.questions.length > 0) {
        const quizTitle = quizData.title || `Technical Quiz - ${jobOffer.title}`;
        const skillTarget = quizData.skillTarget || "General";

        updateData.quiz = {
            upsert: {
                create: {
                    title: quizTitle,
                    skillTarget: skillTarget,
                    status: "VALIDATED",
                    questions: {
                        create: quizData.questions.map((q) => ({
                            text: q.text,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                        })),
                    },
                },
                update: {
                    title: quizTitle,
                    skillTarget: skillTarget,
                    status: "VALIDATED",
                    questions: {
                        deleteMany: {}, // Delete old questions
                        create: quizData.questions.map((q) => ({
                            text: q.text,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                        })),
                    },
                },
            },
        };
    }

    // Update DB (pass triggerWebhook = false via calling prisma directly to avoid loops)
    return prisma.jobOffer.update({
        where: { id },
        data: updateData,
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
            quiz: { include: { questions: true } },
        },
    });
};
