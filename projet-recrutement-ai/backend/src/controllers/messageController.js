import * as messageService from "../services/messageService.js";

export const getMessagesByApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        if (!applicationId) {
            return res.status(400).json({ success: false, error: "Application ID is required" });
        }

        const messages = await messageService.getMessagesByApplication(applicationId);
        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getRecruiterConversations = async (req, res) => {
    try {
        const conversations = await messageService.getRecruiterConversations();
        return res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        console.error("Error fetching recruiter conversations:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getCandidateConversations = async (req, res) => {
    try {
        const conversations = await messageService.getCandidateConversations();
        return res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        console.error("Error fetching candidate conversations:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { applicationId, senderId, senderRole, senderName, content } = req.body;
        if (!applicationId || !senderId || !content) {
            return res.status(400).json({
                success: false,
                error: "applicationId, senderId, and content are required",
            });
        }

        const newMessage = await messageService.createMessage({
            applicationId,
            senderId,
            senderRole,
            senderName,
            content,
        });

        const io = req.app.get("io");
        if (io) {
            io.to(`app_${applicationId}`).emit("receive_message", newMessage);
            io.emit("conversation_updated", newMessage);
        }

        return res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, error: "Content is required" });
        }

        const updated = await messageService.updateMessage(messageId, content);
        if (!updated) {
            return res.status(404).json({ success: false, error: "Message not found" });
        }

        const io = req.app.get("io");
        if (io) {
            io.to(`app_${updated.applicationId}`).emit("receive_message", updated);
            io.to(`app_${updated.applicationId}`).emit("message_edited", updated);
            io.emit("conversation_updated", updated);
        }

        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating message:", error);
        return res.status(400).json({ success: false, error: error.message || "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const deleted = await messageService.deleteMessage(messageId);
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Message not found" });
        }

        const io = req.app.get("io");
        if (io) {
            io.to(`app_${deleted.applicationId}`).emit("receive_message", deleted);
            io.to(`app_${deleted.applicationId}`).emit("message_deleted", deleted);
            io.emit("conversation_updated", deleted);
        }

        return res.status(200).json({ success: true, data: deleted });
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const { role } = req.query;
        if (!role) {
            return res.status(400).json({ success: false, error: "Role is required" });
        }

        const count = await messageService.getUnreadCount(role);
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { role } = req.body;

        await messageService.markAsRead(applicationId, role);

        const io = req.app.get("io");
        if (io) {
            io.to(`app_${applicationId}`).emit("messages_read", { applicationId, readerRole: role });
            io.emit("conversation_updated");
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};
