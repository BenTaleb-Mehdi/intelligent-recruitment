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
    if (name || image !== undefined) {
        await prisma.user.update({
            where: { id: userId },
            data: { 
                name,
                image: image !== undefined ? image : undefined
            },
        });
    }

    // Handle skills disconnect/connect
    let skillsUpdate = {};
    if (skills && Array.isArray(skills)) {
        skillsUpdate = {
            set: [], // Clear all current relations
            connectOrCreate: skills.map((name) => ({
                where: { name },
                create: { name },
            })),
        };
    }

    return prisma.candidate.update({
        where: { userId },
        data: {
            title,
            bio,
            phone,
            location,
            experience,
            githubUrl,
            linkedinUrl,
            portfolioUrl,
            cvPath,
            skills: skills && Array.isArray(skills) ? skillsUpdate : undefined,
        },
        include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            skills: { select: { id: true, name: true } },
        },
    });
};
