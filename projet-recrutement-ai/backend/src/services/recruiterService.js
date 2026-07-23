import prisma from "../config/db.js";

export const getAllRecruiters = async () => {
    return prisma.recruiter.findMany({
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
};

export const getRecruiterById = async (id) => {
    return prisma.recruiter.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
};

export const getRecruiterByUserId = async (userId) => {
    return prisma.recruiter.findUnique({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
    });
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

export const deleteRecruiter = async (id) => {
    return prisma.recruiter.delete({ where: { id } });
};
