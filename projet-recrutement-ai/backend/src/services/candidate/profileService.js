import prisma from "../../config/db.js";
import DataAI from "../../models/DataAI.js";
import Cv from "../../models/Cv.js";

/**
 * Fetch AI Parsed Data from MongoDB dataAI collection by userId
 */
export const getDataAIByUserId = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        const cvDoc = await Cv.findOne({ userId });

        const query = {
            $or: [
                { userId },
                ...(cvDoc ? [{ cvId: cvDoc._id.toString() }, { fileId: cvDoc.fileId }] : []),
                ...(user?.email ? [{ email: user.email }] : [])
            ]
        };

        const dataAiDoc = await DataAI.findOne(query).sort({ createdAt: -1 });
        return dataAiDoc;
    } catch (error) {
        console.error("[DataAI Error] Failed to fetch dataAI record:", error.message);
        return null;
    }
};

/**
 * Fetch a candidate profile by userId. Creates a default profile if none exists.
 */
export const getCandidateProfile = async (userId) => {
    let candidate = await prisma.candidate.findUnique({
        where: { userId },
        include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            skills: { select: { id: true, name: true } },
        },
    });

    if (!candidate) {
        candidate = await prisma.candidate.create({
            data: {
                userId,
                title: "Developer",
                status: "AVAILABLE",
            },
            include: {
                user: { select: { id: true, name: true, email: true, image: true } },
                skills: { select: { id: true, name: true } },
            },
        });
    }

    const dataAI = await getDataAIByUserId(userId);

    return {
        ...candidate,
        dataAI,
    };
};

/**
 * Update candidate profile and skills
 */
export const updateCandidateProfile = async (userId, data) => {
    const { name, image, title, bio, phone, location, experience, githubUrl, linkedinUrl, portfolioUrl, skills, cvPath, languages, education, projects } = data;

    // Update user name and image if provided
    if (name !== undefined || image !== undefined) {
        const userData = {};
        if (name !== undefined) userData.name = name;
        if (image !== undefined) userData.image = image;
        await prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    }

    // Handle skills disconnect/connect
    let skillsUpdate = undefined;
    if (skills && Array.isArray(skills)) {
        skillsUpdate = {
            set: [], // Clear all current relations
            connectOrCreate: skills.map((name) => ({
                where: { name },
                create: { name },
            })),
        };
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (experience !== undefined) updateData.experience = experience;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (cvPath !== undefined) updateData.cvPath = cvPath;
    if (skillsUpdate) updateData.skills = skillsUpdate;

    // Sync with MongoDB dataAI collection
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });
        const cvDoc = await Cv.findOne({ userId });
        const query = {
            $or: [
                { userId },
                ...(cvDoc ? [{ cvId: cvDoc._id.toString() }, { fileId: cvDoc.fileId }] : []),
                ...(user?.email ? [{ email: user.email }] : [])
            ]
        };

        const existingDoc = await DataAI.findOne(query).sort({ createdAt: -1 });
        if (existingDoc) {
            if (!existingDoc.parsedData) {
                existingDoc.parsedData = {};
            }
            
            if (name !== undefined) existingDoc.parsedData.fullName = name;
            if (title !== undefined) existingDoc.parsedData.title = title;
            if (bio !== undefined) existingDoc.parsedData.about = bio;
            if (location !== undefined) existingDoc.parsedData.location = location;
            
            if (!existingDoc.parsedData.contacts) {
                existingDoc.parsedData.contacts = {};
            }
            if (phone !== undefined) existingDoc.parsedData.contacts.phone = phone;
            if (portfolioUrl !== undefined) existingDoc.parsedData.contacts.portfolio = portfolioUrl;
            if (linkedinUrl !== undefined) existingDoc.parsedData.contacts.linkedin = linkedinUrl;
            if (githubUrl !== undefined) existingDoc.parsedData.contacts.github = githubUrl;
            
            if (skills !== undefined && Array.isArray(skills)) {
                existingDoc.parsedData.technicalSkills = skills;
            }

            if (languages !== undefined && Array.isArray(languages)) {
                existingDoc.parsedData.languages = languages;
            }

            if (education !== undefined && Array.isArray(education)) {
                existingDoc.parsedData.education = education;
            }

            if (projects !== undefined && Array.isArray(projects)) {
                existingDoc.parsedData.projects = projects;
            }
            
            if (experience !== undefined) {
                try {
                    const parsedExperience = JSON.parse(experience);
                    if (Array.isArray(parsedExperience)) {
                        existingDoc.parsedData.experience = parsedExperience.map((item) => ({
                            title: item.role || item.title || "",
                            company: item.company || "",
                            duration: item.period || "",
                            description: item.description || ""
                        }));
                    }
                } catch (e) {
                    console.error("Error parsing experience for MongoDB sync:", e.message);
                }
            }

            existingDoc.markModified("parsedData");
            await existingDoc.save();
        }
    } catch (mongoError) {
        console.error("[DataAI Sync Error] Failed to update MongoDB collection:", mongoError.message);
    }

    return prisma.candidate.update({
        where: { userId },
        data: updateData,
        include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            skills: { select: { id: true, name: true } },
        },
    });
};

/**
 * Update candidate CV file path in database
 */
export const updateCandidateCv = async (userId, cvPath) => {
    return prisma.candidate.update({
        where: { userId },
        data: { cvPath },
        include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            skills: { select: { id: true, name: true } },
        },
    });
};

