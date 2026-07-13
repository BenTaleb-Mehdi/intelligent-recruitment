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
            quiz: true,
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

export const createJobOffer = async (data) => {
    return prisma.jobOffer.create({
        data,
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
        },
    });
};

export const updateJobOffer = async (id, data) => {
    return prisma.jobOffer.update({
        where: { id },
        data,
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
        },
    });
};

export const deleteJobOffer = async (id) => {
    return prisma.jobOffer.delete({ where: { id } });
};

export const toggleJobOfferStatus = async (id) => {
    const offer = await prisma.jobOffer.findUnique({ where: { id } });
    if (!offer) return null;

    return prisma.jobOffer.update({
        where: { id },
        data: { status: offer.status === "OPEN" ? "CLOSED" : "OPEN" },
        include: {
            recruiter: { select: { id: true, companyName: true } },
            skills: { select: { id: true, name: true } },
        },
    });
};
