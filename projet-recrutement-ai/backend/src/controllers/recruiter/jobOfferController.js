import * as jobOfferService from "../../services/jobOfferService.js";
import prisma from "../../config/db.js";

export const getAllJobOffers = async (req, res) => {
    try {
        const { recruiterId, status, location, contractType } = req.query;
        const offers = await jobOfferService.getAllJobOffers({ recruiterId, status, location, contractType });
        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        console.error("Error fetching job offers:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getJobOfferById = async (req, res) => {
    try {
        const offer = await jobOfferService.getJobOfferById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }
        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        console.error("Error fetching job offer:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getJobOffersByRecruiter = async (req, res) => {
    try {
        const offers = await jobOfferService.getJobOffersByRecruiterId(req.params.recruiterId);
        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        console.error("Error fetching recruiter job offers:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const createJobOffer = async (req, res) => {
    try {
        const { recruiterId, title, description, contractType, locationType, salary, experienceYears, location, skills } = req.body;
        if (!recruiterId || !title || !description || !contractType || !locationType) {
            return res.status(400).json({
                success: false,
                error: "recruiterId, title, description, contractType, and locationType are required",
            });
        }

        const data = {
            recruiterId, title, description, contractType, locationType,
            salary, experienceYears: experienceYears ?? 0, location,
        };

        if (skills && skills.length > 0) {
            data.skills = {
                connectOrCreate: skills.map((name) => ({
                    where: { name },
                    create: { name },
                })),
            };
        }

        const offer = await jobOfferService.createJobOffer(data);

        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: offer.id,
                    title: offer.title,
                    skills: skills || [],
                    contractType: offer.contractType,
                    locationType: offer.locationType,
                    experienceYears: offer.experienceYears,
                    location: offer.location,
                    salary: offer.salary,
                    description: offer.description,
                }),
            }).catch((err) => {
                console.error("Error calling n8n webhook:", err);
            });
        }

        res.status(201).json({ success: true, data: offer });
    } catch (error) {
        console.error("Error creating job offer:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateJobOffer = async (req, res) => {
    try {
        const offer = await jobOfferService.getJobOfferById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }

        const { title, description, contractType, locationType, salary, experienceYears, location, status, skills } = req.body;

        const data = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (contractType !== undefined) data.contractType = contractType;
        if (locationType !== undefined) data.locationType = locationType;
        if (salary !== undefined) data.salary = salary;
        if (experienceYears !== undefined) data.experienceYears = experienceYears;
        if (location !== undefined) data.location = location;
        if (status !== undefined) data.status = status;

        if (skills && Array.isArray(skills)) {
            data.skills = {
                set: [],
                connectOrCreate: skills.map((name) => ({
                    where: { name },
                    create: { name },
                })),
            };
        }

        const updated = await jobOfferService.updateJobOffer(req.params.id, data);
        if (process.env.N8N_WEBHOOK_URL && (title || contractType || location || experienceYears || skills)) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: updated.id,
                    title: updated.title,
                    contractType: updated.contractType,
                    location: updated.location, 
                    experienceYears: updated.experienceYears,
                    skills: updated.skills ? updated.skills.map(s => s.name).join(', ') : "",
                    salary: updated.salary
                }),
            }).catch((err) => {
                console.error("Error calling n8n webhook on update:", err);
            });
        }
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating job offer:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deleteJobOffer = async (req, res) => {
    try {
        const offer = await jobOfferService.getJobOfferById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }

        await jobOfferService.deleteJobOffer(req.params.id);
        res.status(200).json({ success: true, message: "Job offer deleted successfully" });
    } catch (error) {
        console.error("Error deleting job offer:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const toggleStatus = async (req, res) => {
    try {
        const offer = await jobOfferService.toggleJobOfferStatus(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }
        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        console.error("Error toggling job offer status:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateDescriptionFromWebhook = async (req, res) => {
    try {
        const { id: paramId } = req.params;
        const { id: bodyId, description, quiz, secretToken } = req.body || {};
        const id = paramId || bodyId;

        // Security check
        if (process.env.WEBHOOK_SECRET && secretToken !== process.env.WEBHOOK_SECRET) {
            return res.status(403).json({ success: false, error: "Unauthorized webhook token" });
        }

        if (!id) {
            return res.status(400).json({ success: false, error: "Job offer ID is required (in URL or body)" });
        }

        if (!description) {
            return res.status(400).json({ success: false, error: "description is required" });
        }

        console.log(`[Webhook] Processing job offer update for ID: ${id}`);
        const updated = await jobOfferService.updateJobOffer(id, { description });
        console.log(`[Webhook] Job offer description updated successfully.`);

        // If quiz is provided in the webhook body, insert it into the database
        if (quiz) {
            console.log(`[Webhook] Quiz object received:`, JSON.stringify(quiz, null, 2));
            if (quiz.title && quiz.questions && Array.isArray(quiz.questions)) {
                console.log(`[Webhook] Storing quiz with ${quiz.questions.length} questions in DB...`);
                
                // Delete existing quiz for this job offer
                await prisma.quiz.deleteMany({
                    where: { jobOfferId: id }
                });

                // Format target skills based on the offer's skills
                const skillNames = updated.skills ? updated.skills.map(s => s.name).join(", ") : "";

                // Create new quiz with questions
                await prisma.quiz.create({
                    data: {
                        jobOfferId: id,
                        title: quiz.title,
                        skillTarget: quiz.skillTarget || skillNames || "Général",
                        status: "PENDING",
                        questions: {
                            create: quiz.questions.map(q => ({
                                text: q.text,
                                options: q.options,
                                correctAnswer: (() => {
                                    if (typeof q.correctAnswer === "number") {
                                        return q.correctAnswer;
                                    }
                                    const ansStr = String(q.correctAnswer || "").trim();
                                    if (!ansStr) return 0;

                                    // 1. If it's a number string (e.g. "2")
                                    if (/^\d+$/.test(ansStr)) {
                                        return parseInt(ansStr, 10);
                                    }

                                    // 2. If it matches one of the options
                                    if (Array.isArray(q.options)) {
                                        const index = q.options.indexOf(q.correctAnswer);
                                        if (index !== -1) return index;

                                        const cleanOptions = q.options.map(o => String(o).trim().toLowerCase());
                                        const lowerAns = ansStr.toLowerCase();
                                        const lowerIndex = cleanOptions.indexOf(lowerAns);
                                        if (lowerIndex !== -1) return lowerIndex;
                                    }

                                    // 3. If it's a letter (A, B, C, D)
                                    const letterMap = { A: 0, B: 1, C: 2, D: 3, E: 4 };
                                    const upperLetter = ansStr.toUpperCase();
                                    if (letterMap[upperLetter] !== undefined) {
                                        return letterMap[upperLetter];
                                    }

                                    return 0;
                                })()
                            }))
                        }
                    }
                });
                console.log(`[Webhook] Quiz stored successfully.`);
            } else {
                console.warn(`[Webhook] Quiz missing title, questions, or questions is not an array.`);
            }
        } else {
            console.log(`[Webhook] No quiz provided in request.`);
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating job description and quiz from webhook:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const regenerateDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await jobOfferService.getJobOfferById(id);
        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }

        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: offer.id,
                    title: offer.title,
                    contractType: offer.contractType,
                    location: offer.location,
                    locationType: offer.locationType,
                    experienceYears: offer.experienceYears,
                    skills: offer.skills ? offer.skills.map(s => s.name) : [],
                    salary: offer.salary,
                    description: offer.description,
                }),
            }).catch((err) => {
                console.error("Error calling n8n webhook on regenerate:", err);
            });
        }

        res.status(200).json({ success: true, message: "Regeneration triggered successfully" });
    } catch (error) {
        console.error("Error regenerating job description:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateJobOfferQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, questions, title, skillTarget, duration, deadline } = req.body;

        const offer = await jobOfferService.getJobOfferById(id);
        if (!offer) {
            return res.status(404).json({ success: false, error: "Job offer not found" });
        }

        const parseValidDate = (dateVal) => {
            if (!dateVal) return null;
            const d = new Date(dateVal);
            return isNaN(d.getTime()) ? null : d;
        };

        const safeDuration = duration !== undefined ? (parseInt(duration, 10) || 30) : 30;
        const safeDeadline = deadline !== undefined ? parseValidDate(deadline) : undefined;

        let quiz = await prisma.quiz.findUnique({
            where: { jobOfferId: id }
        });

        const updateData = {
            status: status || (quiz ? quiz.status : "PENDING"),
            title: title || (quiz ? quiz.title : `Quiz - ${offer.title}`),
            skillTarget: skillTarget || (quiz ? quiz.skillTarget : "Général"),
        };

        if (safeDuration !== undefined) updateData.duration = safeDuration;
        if (safeDeadline !== undefined) updateData.deadline = safeDeadline;

        try {
            if (!quiz) {
                quiz = await prisma.quiz.create({
                    data: {
                        jobOfferId: id,
                        ...updateData
                    }
                });
            } else {
                quiz = await prisma.quiz.update({
                    where: { id: quiz.id },
                    data: updateData
                });
            }
        } catch (dbErr) {
            if (dbErr.message && (dbErr.message.includes("Unknown argument `duration`") || dbErr.message.includes("Unknown argument `deadline`"))) {
                delete updateData.duration;
                delete updateData.deadline;
                if (!quiz) {
                    quiz = await prisma.quiz.create({
                        data: {
                            jobOfferId: id,
                            ...updateData
                        }
                    });
                } else {
                    quiz = await prisma.quiz.update({
                        where: { id: quiz.id },
                        data: updateData
                    });
                }
            } else {
                throw dbErr;
            }
        }

        if (questions && Array.isArray(questions)) {
            await prisma.question.deleteMany({
                where: { quizId: quiz.id }
            });

            const validQuestions = questions.map((q, idx) => {
                const text = (q.text || q.question || `Question ${idx + 1}`).trim();
                const options = Array.isArray(q.options) ? q.options : [];
                
                let correctAnswer = 0;
                if (typeof q.correctAnswer === "number" && !isNaN(q.correctAnswer)) {
                    correctAnswer = Math.max(0, Math.floor(q.correctAnswer));
                } else {
                    const ansStr = String(q.correctAnswer || "").trim();
                    if (/^\d+$/.test(ansStr)) {
                        correctAnswer = parseInt(ansStr, 10);
                    } else if (Array.isArray(options)) {
                        const index = options.indexOf(q.correctAnswer);
                        if (index !== -1) {
                            correctAnswer = index;
                        } else {
                            const cleanOptions = options.map(o => String(o).trim().toLowerCase());
                            const lowerAns = ansStr.toLowerCase();
                            const lowerIndex = cleanOptions.indexOf(lowerAns);
                            if (lowerIndex !== -1) {
                                correctAnswer = lowerIndex;
                            }
                        }
                    }
                    
                    const letterMap = { A: 0, B: 1, C: 2, D: 3, E: 4 };
                    const upper = ansStr.toUpperCase();
                    if (letterMap[upper] !== undefined) {
                        correctAnswer = letterMap[upper];
                    }
                }

                if (isNaN(correctAnswer) || correctAnswer < 0) {
                    correctAnswer = 0;
                }

                return {
                    quizId: quiz.id,
                    text,
                    options,
                    correctAnswer
                };
            });

            if (validQuestions.length > 0) {
                await prisma.question.createMany({
                    data: validQuestions
                });
            }
        }

        const updatedQuiz = await prisma.quiz.findUnique({
            where: { id: quiz.id },
            include: { questions: true }
        });

        res.status(200).json({ success: true, data: updatedQuiz });
    } catch (error) {
        console.error("Error updating job offer quiz:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};
