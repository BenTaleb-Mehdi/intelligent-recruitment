import * as quizService from "../../services/candidate/quizService.js";
import { getCandidateProfile } from "../../services/candidate/profileService.js";

const getCandidateIdFromUser = async (userId) => {
    const profile = await getCandidateProfile(userId);
    return profile.id;
};

export const getCandidateQuizzes = async (req, res) => {
    try {
        const candidateId = await getCandidateIdFromUser(req.user.id);
        const quizzes = await quizService.getCandidateQuizzes(candidateId);
        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        console.error("Error in getCandidateQuizzes:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};

export const submitQuizResult = async (req, res) => {
    try {
        const candidateId = await getCandidateIdFromUser(req.user.id);
        const quizId = req.params.id;
        const { score } = req.body;

        if (score === undefined) {
            return res.status(400).json({ success: false, error: "score is required" });
        }

        const result = await quizService.submitQuizResult(candidateId, quizId, score);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in submitQuizResult:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};
