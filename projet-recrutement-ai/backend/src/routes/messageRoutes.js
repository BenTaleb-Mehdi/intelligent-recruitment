import { Router } from "express";
import {
  getMessagesByApplication,
  getRecruiterConversations,
  getCandidateConversations,
  createMessage,
  updateMessage,
  deleteMessage,
  getUnreadCount,
  markAsRead,
} from "../controllers/messageController.js";
import {
  protectDashboard,
  requireApplicationParticipant,
  requireMessageParticipant,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/messages", protectDashboard, requireApplicationParticipant, createMessage);
router.get("/messages/conversations/recruiter", protectDashboard, getRecruiterConversations);
router.get("/messages/conversations/candidate", protectDashboard, getCandidateConversations);
router.get("/messages/unread-count", protectDashboard, getUnreadCount);
router.put("/messages/read/:applicationId", protectDashboard, requireApplicationParticipant, markAsRead);
router.put("/messages/:messageId", protectDashboard, requireMessageParticipant, updateMessage);
router.delete("/messages/:messageId", protectDashboard, requireMessageParticipant, deleteMessage);
router.get("/messages/:applicationId", protectDashboard, requireApplicationParticipant, getMessagesByApplication);


export default router;
