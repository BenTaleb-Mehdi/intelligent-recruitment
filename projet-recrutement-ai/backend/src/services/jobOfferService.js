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
            recruiter: { select: { id: true, companyName: true, logo: true, headquarters: true, iceNumber: true, rcNumber: true } },
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
            recruiter: { select: { id: true, companyName: true, logo: true, headquarters: true, iceNumber: true, rcNumber: true } },
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
            recruiter: { select: { id: true, companyName: true, logo: true, headquarters: true, iceNumber: true, rcNumber: true } },
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
            recruiter: { select: { id: true, companyName: true, logo: true, headquarters: true, iceNumber: true, rcNumber: true } },
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
            recruiter: { select: { id: true, companyName: true, logo: true, headquarters: true, iceNumber: true, rcNumber: true } },
            skills: { select: { id: true, name: true } },
        },
    });

    await triggerN8NWebhook(updatedOffer);

    return updatedOffer;
};

export const formatCorrectAnswer = (ans, options = []) => {
    let ansList = [];
    if (Array.isArray(ans)) {
        ansList = ans;
    } else if (ans !== undefined && ans !== null) {
        ansList = [ans];
    }

    if (ansList.length === 0) return 1;

    let bitmask = 0;
    ansList.forEach((item) => {
        let idx = -1;

        if (typeof item === "number" && !isNaN(item)) {
            idx = item;
        } else if (typeof item === "string" && !isNaN(parseInt(item, 10)) && String(parseInt(item, 10)) === item.trim()) {
            idx = parseInt(item, 10);
        } else if (typeof item === "string" && Array.isArray(options) && options.length > 0) {
            const cleanItem = item.trim().toLowerCase();
            let foundIdx = options.findIndex((opt) => String(opt).trim().toLowerCase() === cleanItem);
            if (foundIdx === -1) {
                foundIdx = options.findIndex((opt) => {
                    const cleanOpt = String(opt).trim().toLowerCase();
                    return cleanOpt.length > 3 && (cleanOpt.includes(cleanItem) || cleanItem.includes(cleanOpt));
                });
            }
            if (foundIdx !== -1) {
                idx = foundIdx;
            }
        }

        if (idx >= 0 && idx < 8) {
            bitmask |= (1 << idx);
        }
    });

    return bitmask > 0 ? bitmask : 1;
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
                            text: q.text || q.question || "",
                            options: Array.isArray(q.options) ? q.options : [],
                            correctAnswer: formatCorrectAnswer(q.correctAnswers || q.correctAnswer, q.options),
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
                            text: q.text || q.question || "",
                            options: Array.isArray(q.options) ? q.options : [],
                            correctAnswer: formatCorrectAnswer(q.correctAnswers || q.correctAnswer, q.options),
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
            recruiter: { select: { id: true, companyName: true, logo: true, headquarters: true, iceNumber: true, rcNumber: true } },
            skills: { select: { id: true, name: true } },
            quiz: { include: { questions: true } },
        },
    });
};

export const updateJobOfferQuiz = async (jobOfferId, quizData) => {
    const jobOffer = await prisma.jobOffer.findUnique({
        where: { id: jobOfferId },
        include: { quiz: true },
    });

    if (!jobOffer) return null;

    const quizTitle = quizData.title || jobOffer.quiz?.title || `Technical Quiz - ${jobOffer.title}`;
    const skillTarget = quizData.skillTarget || jobOffer.quiz?.skillTarget || "General";
    const status = quizData.status || "VALIDATED";
    const duration = quizData.duration !== undefined ? Number(quizData.duration) : (jobOffer.quiz?.duration ?? 30);
    const deadline = quizData.deadline ? new Date(quizData.deadline) : null;

    const questionsCreate = Array.isArray(quizData.questions)
        ? quizData.questions.map((q) => ({
              text: q.text || q.question || "",
              options: Array.isArray(q.options) ? q.options : [],
              correctAnswer: formatCorrectAnswer(q.correctAnswers || q.correctAnswer, q.options),
          }))
        : undefined;

    const updateFields = {
        title: quizTitle,
        skillTarget,
        status,
        duration,
        deadline,
    };

    if (questionsCreate) {
        updateFields.questions = {
            deleteMany: {},
            create: questionsCreate,
        };
    }

    return prisma.quiz.upsert({
        where: { jobOfferId },
        create: {
            jobOfferId,
            title: quizTitle,
            skillTarget,
            status,
            duration,
            deadline,
            questions: questionsCreate ? { create: questionsCreate } : undefined,
        },
        update: updateFields,
        include: {
            questions: true,
        },
    });
};

export const getJobOfferApplicants = async (jobOfferId) => {
    const applications = await prisma.application.findMany({
        where: { jobOfferId },
        include: {
            candidate: {
                include: {
                    user: { select: { id: true, name: true, email: true, image: true } },
                    skills: { select: { name: true } },
                },
            },
        },
        orderBy: { appliedDate: "desc" },
    });

    if (applications.length === 0) {
        const allCandidates = await prisma.candidate.findMany({
            include: {
                user: { select: { id: true, name: true, email: true, image: true } },
                skills: { select: { name: true } },
            },
        });

        return allCandidates.map((c) => ({
            id: c.id,
            candidateId: c.id,
            name: c.user?.name || "Candidat Anonyme",
            email: c.user?.email || "",
            image: c.user?.image || "",
            phone: c.phone || "",
            location: c.location || "",
            bio: c.bio || "",
            status: "Nouveau",
            appliedDate: new Date().toISOString(),
            skills: c.skills ? c.skills.map((s) => s.name) : [],
            experience: c.experience || "",
            github: c.githubUrl || "",
            linkedin: c.linkedinUrl || "",
            portfolio: c.portfolioUrl || "",
            cv: c.cvPath || "",
            rating: c.employabilityScore ? Number((c.employabilityScore / 20).toFixed(1)) : 4.0,
        }));
    }

    const statusMap = {
        NEW: "Nouveau",
        INTERVIEW: "Entretien",
        IN_PROGRESS: "En cours",
        REJECTED: "Refusé",
    };

    return applications.map((app) => ({
        id: app.id,
        applicationId: app.id,
        candidateId: app.candidateId,
        name: app.candidate?.user?.name || "Candidat Anonyme",
        email: app.candidate?.user?.email || "",
        image: app.candidate?.user?.image || "",
        phone: app.candidate?.phone || "",
        location: app.candidate?.location || "",
        bio: app.candidate?.bio || "",
        status: statusMap[app.status] || "Nouveau",
        appliedDate: app.appliedDate ? new Date(app.appliedDate).toISOString() : "",
        skills: app.candidate?.skills ? app.candidate.skills.map((s) => s.name) : [],
        experience: app.candidate?.experience || "",
        github: app.candidate?.githubUrl || "",
        linkedin: app.candidate?.linkedinUrl || "",
        portfolio: app.candidate?.portfolioUrl || "",
        cv: app.candidate?.cvPath || "",
        rating: app.matchScore ? Number((app.matchScore / 20).toFixed(1)) : 0,
        matchScore: app.matchScore || 0,
        matchExplanation: app.matchExplanation || "",
    }));
};

