import Message from "../models/Message.js";
import prisma from "../config/db.js";

export const getMessagesByApplication = async (applicationId) => {
    return Message.find({ applicationId }).sort({ createdAt: 1 });
};

export const getRecruiterConversations = async () => {
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

    return Promise.all(
        rawConversations.map(async (c) => {
            const candidateObj = c.senders.find((s) => s.senderRole === "CANDIDATE") || c.senders[0];
            let candidateImage = "";
            let candidateBio = "";
            let candidateTitle = "Candidat Postulant";
            let realName = candidateObj?.senderName || "Mehdi Ben Taleb";

            try {
                let app = await prisma.application.findUnique({
                    where: { id: c._id },
                    include: {
                        candidate: {
                            include: {
                                user: { select: { id: true, name: true, email: true, image: true } }
                            }
                        },
                        jobOffer: { select: { title: true } }
                    }
                });

                if (!app && candidateObj?.senderId) {
                    app = await prisma.application.findFirst({
                        where: { candidateId: candidateObj.senderId },
                        include: {
                            candidate: {
                                include: {
                                    user: { select: { id: true, name: true, email: true, image: true } }
                                }
                            },
                            jobOffer: { select: { title: true } }
                        }
                    });
                }

                if (app?.candidate) {
                    if (app.candidate.user?.name) realName = app.candidate.user.name;
                    if (app.candidate.user?.image) candidateImage = app.candidate.user.image;
                    if (app.candidate.bio) candidateBio = app.candidate.bio;
                } else {
                    const candidate = await prisma.candidate.findFirst({
                        include: { user: { select: { name: true, image: true } } }
                    });
                    if (candidate?.user?.image) candidateImage = candidate.user.image;
                    if (candidate?.user?.name) realName = candidate.user.name;
                }

                if (app?.jobOffer?.title) {
                    candidateTitle = app.jobOffer.title;
                }
            } catch (err) {
                console.error("Error fetching candidate info for conversation:", err);
            }

            const parts = realName.split(" ").filter(Boolean);
            const avatar =
                parts.length >= 2
                    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                    : realName.slice(0, 2).toUpperCase();

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
                candidateName: realName,
                candidateAvatar: avatar,
                candidateImage: candidateImage,
                image: candidateImage,
                candidateBio: candidateBio,
                candidateTitle: candidateTitle,
                lastMessage: c.lastMessage,
                lastTime: timeStr,
                unread: unreadCount,
                online: true,
            };
        })
    );
};

export const getCandidateConversations = async () => {
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

    return Promise.all(
        rawConversations.map(async (c) => {
            const recruiterObj = c.senders.find((s) => s.senderRole === "RECRUITER");
            let recruiterName = recruiterObj?.senderName || "Recruteur SmartRecruit";
            let companyName = "SmartRecruit";
            let recruiterImage = "";
            let roleTitle = "Offre d'emploi";

            try {
                let app = await prisma.application.findUnique({
                    where: { id: c._id },
                    include: {
                        jobOffer: {
                            include: {
                                recruiter: {
                                    include: {
                                        user: { select: { name: true, image: true } }
                                    }
                                }
                            }
                        }
                    }
                });

                if (!app && recruiterObj?.senderId) {
                    const recruiter = await prisma.recruiter.findUnique({
                        where: { id: recruiterObj.senderId },
                        include: { user: { select: { name: true, image: true } } }
                    });
                    if (recruiter) {
                        companyName = recruiter.companyName || companyName;
                        if (recruiter.user?.name) recruiterName = recruiter.user.name;
                        recruiterImage = recruiter.logo || recruiter.user?.image || "";
                    }
                }

                if (app?.jobOffer) {
                    roleTitle = app.jobOffer.title || roleTitle;
                    if (app.jobOffer.recruiter) {
                        companyName = app.jobOffer.recruiter.companyName || companyName;
                        if (app.jobOffer.recruiter.user?.name) {
                            recruiterName = app.jobOffer.recruiter.user.name;
                        }
                        if (app.jobOffer.recruiter.logo) {
                            recruiterImage = app.jobOffer.recruiter.logo;
                        } else if (app.jobOffer.recruiter.user?.image) {
                            recruiterImage = app.jobOffer.recruiter.user.image;
                        }
                    }
                } else if (!recruiterImage) {
                    const recruiter = await prisma.recruiter.findFirst({
                        include: { user: { select: { name: true, image: true } } }
                    });
                    if (recruiter) {
                        companyName = recruiter.companyName || companyName;
                        if (recruiter.user?.name) recruiterName = recruiter.user.name;
                        recruiterImage = recruiter.logo || recruiter.user?.image || "";
                    }
                }
            } catch (err) {
                console.error("Error fetching recruiter info for conversation:", err);
            }

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
                companyName: companyName,
                recruiterName: recruiterName,
                recruiterImage: recruiterImage,
                logo: recruiterImage,
                image: recruiterImage,
                role: roleTitle,
                avatar: companyName.slice(0, 2).toUpperCase(),
                lastMessage: c.lastMessage,
                lastTime: timeStr,
                unread: unreadCount,
                online: true,
            };
        })
    );
};

export const createMessage = async (data) => {
    return Message.create({
        applicationId: data.applicationId,
        senderId: data.senderId,
        senderRole: data.senderRole || "CANDIDATE",
        senderName: data.senderName || "Utilisateur",
        content: data.content,
    });
};

export const updateMessage = async (messageId, content) => {
    const message = await Message.findById(messageId);
    if (!message) return null;
    if (message.isDeleted) throw new Error("Cannot edit a deleted message");

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();
    return message;
};

export const deleteMessage = async (messageId) => {
    const message = await Message.findById(messageId);
    if (!message) return null;

    message.isDeleted = true;
    message.content = "Ce message a été supprimé";
    await message.save();
    return message;
};

export const getUnreadCount = async (role) => {
    const senderRoleToCount = role === "RECRUITER" ? "CANDIDATE" : "RECRUITER";
    return Message.countDocuments({ senderRole: senderRoleToCount, read: false });
};

export const markAsRead = async (applicationId, role) => {
    const senderRoleToMark = role === "RECRUITER" ? "CANDIDATE" : "RECRUITER";
    return Message.updateMany(
        { applicationId, senderRole: senderRoleToMark, read: false },
        { read: true }
    );
};
