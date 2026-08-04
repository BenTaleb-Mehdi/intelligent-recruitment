import * as profileService from "../../services/candidate/profileService.js";

export const getCandidateProfile = async (req, res) => {
    try {
        const profile = await profileService.getCandidateProfile(req.user.id);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("Error in getCandidateProfile:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};

export const updateCandidateProfile = async (req, res) => {
    try {
        const profile = await profileService.updateCandidateProfile(req.user.id, req.body);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("Error in updateCandidateProfile:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};

import * as cvService from "../../services/cvService.js";

export const uploadCv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No CV file uploaded" });
        }

        const cvDoc = await cvService.uploadCvToGridFS(req.user.id, req.file);

        return res.status(200).json({
            success: true,
            message: "CV uploaded successfully to MongoDB GridFS",
            data: {
                cvPath: `/api/cvs/${req.user.id}/view`,
                originalName: cvDoc.originalName,
                cvDoc,
            },
        });
    } catch (error) {
        console.error("Error in uploadCv controller:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to upload CV" });
    }
};

export const getDataAI = async (req, res) => {
    try {
        const dataAI = await profileService.getDataAIByUserId(req.user.id);
        res.status(200).json({ success: true, data: dataAI });
    } catch (error) {
        console.error("Error in getDataAI controller:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};


