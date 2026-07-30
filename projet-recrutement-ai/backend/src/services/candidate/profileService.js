import prisma from "../../config/db.js";

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

    return candidate;
};

/**
 * Update candidate profile and skills
 */
export const updateCandidateProfile = async (userId, data) => {
    const { name, image, title, bio, phone, location, experience, githubUrl, linkedinUrl, portfolioUrl, skills, cvPath } = data;

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

