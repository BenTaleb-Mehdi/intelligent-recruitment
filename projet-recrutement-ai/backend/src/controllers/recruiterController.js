import * as recruiterService from "../services/recruiterService.js";

export const getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await recruiterService.getAllRecruiters();
        res.status(200).json({ success: true, data: recruiters });
    } catch (error) {
        console.error("Error fetching recruiters:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getRecruiterById = async (req, res) => {
    try {
        const recruiter = await recruiterService.getRecruiterById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }
        res.status(200).json({ success: true, data: recruiter });
    } catch (error) {
        console.error("Error fetching recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const createRecruiter = async (req, res) => {
    try {
        const { userId, companyName, website, industry, teamSize, headquarters, description } = req.body;
        if (!userId || !companyName) {
            return res.status(400).json({ success: false, error: "userId and companyName are required" });
        }

        const existing = await recruiterService.getRecruiterByUserId(userId);
        if (existing) {
            return res.status(409).json({ success: false, error: "Recruiter already exists for this user" });
        }

        const recruiter = await recruiterService.createRecruiter({
            userId, companyName, website, industry, teamSize, headquarters, description,
        });
        res.status(201).json({ success: true, data: recruiter });
    } catch (error) {
        console.error("Error creating recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateRecruiter = async (req, res) => {
    try {
        const recruiter = await recruiterService.getRecruiterById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }

        const { companyName, website, industry, teamSize, headquarters, description } = req.body;
        const updated = await recruiterService.updateRecruiter(req.params.id, {
            ...(companyName !== undefined && { companyName }),
            ...(website !== undefined && { website }),
            ...(industry !== undefined && { industry }),
            ...(teamSize !== undefined && { teamSize }),
            ...(headquarters !== undefined && { headquarters }),
            ...(description !== undefined && { description }),
        });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deleteRecruiter = async (req, res) => {
    try {
        const recruiter = await recruiterService.getRecruiterById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }

        await recruiterService.deleteRecruiter(req.params.id);
        res.status(200).json({ success: true, message: "Recruiter deleted successfully" });
    } catch (error) {
        console.error("Error deleting recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
