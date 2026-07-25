import Message from "../models/Message.js";

export const getMessagesByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ success: false, error: "Application ID is required" });
    }

    const messages = await Message.find({ applicationId }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getRecruiterConversations = async (req, res) => {
  try {
    const rawConversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$applicationId",
          lastMessage: { $first: "$content" },
          lastTime: { $first: "$createdAt" },
          senders: {
            $push: {
              senderId: "$senderId",
              senderName: "$senderName",
              senderRole: "$senderRole",
            },
          },
        },
      },
      { $sort: { lastTime: -1 } },
    ]);

    const formatted = await Promise.all(
      rawConversations.map(async (c) => {
        const candidateObj = c.senders.find((s) => s.senderRole === "CANDIDATE") || c.senders[0];
        const name = candidateObj?.senderName || "Mehdi Ben Taleb";
        const parts = name.split(" ").filter(Boolean);
        const avatar =
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase();

        const date = new Date(c.lastTime);
        const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const unreadCount = await Message.countDocuments({
          applicationId: c._id,
          senderRole: "CANDIDATE",
          read: false,
        });

        return {
          id: c._id,
          applicationId: c._id,
          candidateId: c._id,
          candidateName: name,
          candidateAvatar: avatar,
          candidateTitle: "Candidat Postulant",
          lastMessage: c.lastMessage,
          lastTime: timeStr,
          unread: unreadCount,
          online: true,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching recruiter conversations from MongoDB:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getCandidateConversations = async (req, res) => {
  try {
    const rawConversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$applicationId",
          lastMessage: { $first: "$content" },
          lastTime: { $first: "$createdAt" },
          senders: {
            $push: {
              senderId: "$senderId",
              senderName: "$senderName",
              senderRole: "$senderRole",
            },
          },
        },
      },
      { $sort: { lastTime: -1 } },
    ]);

    const formatted = await Promise.all(
      rawConversations.map(async (c) => {
        const recruiterObj = c.senders.find((s) => s.senderRole === "RECRUITER");
        const name = recruiterObj?.senderName || "Recruteur SmartRecruit";
        const date = new Date(c.lastTime);
        const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const unreadCount = await Message.countDocuments({
          applicationId: c._id,
          senderRole: "RECRUITER",
          read: false,
        });

        return {
          id: c._id,
          applicationId: c._id,
          companyName: "SmartRecruit",
          recruiterName: name,
          role: "Offre d'emploi",
          avatar: "SR",
          lastMessage: c.lastMessage,
          lastTime: timeStr,
          unread: unreadCount,
          online: true,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching candidate conversations from MongoDB:", error);
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

    const newMessage = await Message.create({
      applicationId,
      senderId,
      senderRole: senderRole || "CANDIDATE",
      senderName: senderName || "Utilisateur",
      content,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(`app_${applicationId}`).emit("receive_message", newMessage);
      io.emit("conversation_updated", newMessage);
    }

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
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

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    if (message.isDeleted) {
      return res.status(400).json({ success: false, error: "Cannot edit a deleted message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`app_${message.applicationId}`).emit("receive_message", message);
      io.to(`app_${message.applicationId}`).emit("message_edited", message);
      io.emit("conversation_updated", message);
    }

    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    message.isDeleted = true;
    message.content = "Ce message a été supprimé";
    await message.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`app_${message.applicationId}`).emit("receive_message", message);
      io.to(`app_${message.applicationId}`).emit("message_deleted", message);
      io.emit("conversation_updated", message);
    }

    return res.status(200).json({ success: true, data: message });
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

    const senderRoleToCount = role === "RECRUITER" ? "CANDIDATE" : "RECRUITER";
    const count = await Message.countDocuments({ senderRole: senderRoleToCount, read: false });

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

    const senderRoleToMark = role === "RECRUITER" ? "CANDIDATE" : "RECRUITER";

    await Message.updateMany(
      { applicationId, senderRole: senderRoleToMark, read: false },
      { read: true }
    );

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
