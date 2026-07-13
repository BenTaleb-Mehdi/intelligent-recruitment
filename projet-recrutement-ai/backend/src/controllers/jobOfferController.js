import * as jobOfferService from "../services/jobOfferService.js";

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
