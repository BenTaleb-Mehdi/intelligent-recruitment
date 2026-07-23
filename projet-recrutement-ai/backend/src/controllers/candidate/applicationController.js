import * as applicationService from "../../services/candidate/applicationService.js";
import { getCandidateProfile } from "../../services/candidate/profileService.js";

const getCandidateIdFromUser = async (userId) => {
    const profile = await getCandidateProfile(userId);
    return profile.id;
};

export const getCandidateApplications = async (req, res) => {
    try {
        const candidateId = await getCandidateIdFromUser(req.user.id);
        const applications = await applicationService.getCandidateApplications(candidateId);
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error in getCandidateApplications:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};

export const applyToJob = async (req, res) => {
    try {
        const { jobOfferId } = req.body;
        if (!jobOfferId) {
            return res.status(400).json({ success: false, error: "jobOfferId is required" });
        }

        const candidateId = await getCandidateIdFromUser(req.user.id);
        const application = await applicationService.applyToJob(candidateId, jobOfferId);
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        console.error("Error in applyToJob:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};

export const cancelApplication = async (req, res) => {
    try {
        const candidateId = await getCandidateIdFromUser(req.user.id);
        const applicationId = req.params.id;

        await applicationService.cancelApplication(candidateId, applicationId);
        res.status(200).json({ success: true, message: "Application cancelled successfully" });
    } catch (error) {
        console.error("Error in cancelApplication:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};
