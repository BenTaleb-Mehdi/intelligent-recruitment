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
