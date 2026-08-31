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

const router = Router();

router.post("/messages", createMessage);
router.get("/messages/conversations/recruiter", getRecruiterConversations);
router.get("/messages/conversations/candidate", getCandidateConversations);
router.get("/messages/unread-count", getUnreadCount);
router.put("/messages/read/:applicationId", markAsRead);
router.put("/messages/:messageId", updateMessage);
router.delete("/messages/:messageId", deleteMessage);
router.get("/messages/:applicationId", getMessagesByApplication);


export default router;
