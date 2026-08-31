import prisma from "../config/db.js";

export const getAllRecruiters = async () => {
    return prisma.recruiter.findMany({
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
};

export const getRecruiterById = async (id) => {
    const recruiter = await prisma.recruiter.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
    if (!recruiter) return null;
    if (recruiter.verificationStatus === undefined) {
        try {
            const raw = await prisma.$queryRawUnsafe(
                `SELECT verification_status AS verificationStatus, is_profile_complete AS isProfileComplete FROM recruiter WHERE id = ?`,
                recruiter.id
            );
            if (Array.isArray(raw) && raw.length > 0) {
                recruiter.verificationStatus = raw[0].verificationStatus || "UNVERIFIED";
                recruiter.isProfileComplete = Boolean(raw[0].isProfileComplete);
            }
        } catch {
            recruiter.verificationStatus = "UNVERIFIED";
        }
    }
    return recruiter;
};

export const getRecruiterByUserId = async (userId) => {
    const recruiter = await prisma.recruiter.findUnique({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
    if (!recruiter) return null;
    if (recruiter.verificationStatus === undefined) {
        try {
            const raw = await prisma.$queryRawUnsafe(
                `SELECT verification_status AS verificationStatus, is_profile_complete AS isProfileComplete FROM recruiter WHERE id = ?`,
                recruiter.id
            );
            if (Array.isArray(raw) && raw.length > 0) {
                recruiter.verificationStatus = raw[0].verificationStatus || "UNVERIFIED";
                recruiter.isProfileComplete = Boolean(raw[0].isProfileComplete);
            }
        } catch {
            recruiter.verificationStatus = "UNVERIFIED";
        }
    }
    return recruiter;
};

export const createRecruiter = async (data) => {
    return prisma.recruiter.create({
        data,
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
};

export const updateRecruiter = async (id, data) => {
    return prisma.recruiter.update({
        where: { id },
        data,
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
};

// Helper to ensure database table columns exist in MySQL
async function ensureVerificationColumns() {
    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE recruiter ADD COLUMN verification_status ENUM('UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED') DEFAULT 'UNVERIFIED'`
        );
    } catch {
        // Column already exists
    }
    try {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE recruiter ADD COLUMN is_profile_complete TINYINT(1) DEFAULT 0`
        );
    } catch {
        // Column already exists
    }
}

export const updateVerificationStatus = async (id, { verificationStatus, isProfileComplete, companyName, iceNumber, rcNumber }) => {
    // 1. First ensure columns exist in DB
    await ensureVerificationColumns();

    // 2. Attempt Prisma update
    try {
        return await prisma.recruiter.update({
            where: { id },
            data: {
                verificationStatus,
                ...(isProfileComplete !== undefined && { isProfileComplete }),
                ...(companyName && { companyName }),
                ...(iceNumber && { iceNumber }),
                ...(rcNumber && { rcNumber }),
            },
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
        });
    } catch (error) {
        console.warn("⚠️ Prisma client error, falling back to raw SQL update:", error.message);
        
        // Execute raw SQL update directly on MySQL table
        const isComplete = isProfileComplete ? 1 : 0;
        await prisma.$executeRawUnsafe(
            `UPDATE recruiter SET 
                verification_status = ?, 
                is_profile_complete = ?,
                companyName = COALESCE(?, companyName),
                iceNumber = COALESCE(?, iceNumber),
                rcNumber = COALESCE(?, rcNumber)
             WHERE id = ?`,
            verificationStatus,
            isComplete,
            companyName || null,
            iceNumber || null,
            rcNumber || null,
            id
        );

        // Retrieve updated record
        const recruiter = await prisma.recruiter.findUnique({
            where: { id },
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
        });

        return {
            ...recruiter,
            verificationStatus,
            isProfileComplete: Boolean(isProfileComplete),
        };
    }
};

export const deleteRecruiter = async (id) => {
    return prisma.recruiter.delete({ where: { id } });
};
