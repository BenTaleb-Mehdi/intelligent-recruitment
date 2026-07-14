import prisma from "../config/db.js";

export const getDropdownLists = async (recruiterId, type) => {
    const where = { recruiterId };
    if (type) where.type = type;
    return prisma.dropdownList.findMany({
        where,
        orderBy: { createdAt: "asc" },
    });
};

export const createDropdownItem = async (recruiterId, type, value) => {
    return prisma.dropdownList.create({
        data: { recruiterId, type, value },
    });
};

export const updateDropdownItem = async (id, value) => {
    return prisma.dropdownList.update({
        where: { id },
        data: { value },
    });
};

export const deleteDropdownItem = async (id) => {
    return prisma.dropdownList.delete({ where: { id } });
};

export const bulkCreateDropdownItems = async (recruiterId, type, values) => {
    const data = values.map((value) => ({ recruiterId, type, value }));
    return prisma.dropdownList.createMany({
        data,
        skipDuplicates: true,
    });
};

export const deleteAllByType = async (recruiterId, type) => {
    return prisma.dropdownList.deleteMany({
        where: { recruiterId, type },
    });
};
