import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import connectMongo from "./config/mongo.js";
import Message from "./models/Message.js";
import prisma from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/adminRoutes.js";
import recruiterRouter from "./routes/recruiter/recruiterRoutes.js";
import jobOfferRouter from "./routes/recruiter/jobOfferRoutes.js";
import dropdownListRouter from "./routes/recruiter/dropdownListRoutes.js";
import candidateRouter from "./routes/candidate/candidateRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import reportRouter from "./routes/reportRoutes.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set("io", io);

// Connect to MongoDB
connectMongo();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Better Auth handler mounted directly on /api/auth/*path for Express 5 compatibility
app.all("/api/auth/*path", toNodeHandler(auth));

app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api", authRouter);
app.use(userRouter);
app.use("/api/admin", adminRouter);
app.use(recruiterRouter);
app.use(jobOfferRouter);
app.use(dropdownListRouter);
app.use(candidateRouter);
app.use("/api", messageRouter);
app.use(reportRouter);

const getAccessibleApplication = async (applicationId, user) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      candidate: { select: { userId: true } },
      jobOffer: { select: { recruiter: { select: { userId: true } } } },
    },
  });

  if (!application) return null;
  const role = String(user?.role || "").toUpperCase();
  if (role === "ADMIN" || application.candidate.userId === user?.id || application.jobOffer.recruiter.userId === user?.id) {
    return application;
  }
  return null;
};

io.use(async (socket, next) => {
  try {
    const session = await auth.api.getSession({ headers: socket.handshake.headers });
    if (!session) return next(new Error("Unauthorized"));
    socket.user = session.user;
    next();
  } catch (error) {
    next(new Error("Unable to validate session"));
  }
});

// Socket.IO real-time message handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a specific application chat room
  socket.on("join_room", async (applicationId) => {
    if (!await getAccessibleApplication(applicationId, socket.user)) {
      socket.emit("chat_error", { error: "You cannot access this conversation" });
      return;
    }
    socket.join(`app_${applicationId}`);
    console.log(`Socket ${socket.id} joined room: app_${applicationId}`);
  });

  // Handle sending a message
  socket.on("send_message", async (data) => {
    try {
      const { applicationId, content } = data;

      if (!applicationId || !content) {
        return;
      }

      if (!await getAccessibleApplication(applicationId, socket.user)) return;
      const senderRole = String(socket.user?.role || "").toUpperCase();
      if (senderRole !== "CANDIDATE" && senderRole !== "RECRUITER") return;

      // Save message to MongoDB
      const newMessage = await Message.create({
        applicationId,
        senderId: socket.user.id,
        senderRole,
        senderName: socket.user.name,
        content,
      });

      // Broadcast message to everyone in the room
      io.to(`app_${applicationId}`).emit("receive_message", newMessage);
      io.emit("conversation_updated", newMessage);
    } catch (error) {
      console.error("Error saving message via socket:", error);
    }
  });

  // Handle editing a message
  socket.on("edit_message", async (data) => {
    try {
      const { messageId, content } = data;
      if (!messageId || !content) return;

      const message = await Message.findById(messageId);
      if (message && !message.isDeleted
        && (message.senderId === socket.user?.id || String(socket.user?.role).toUpperCase() === "ADMIN")
        && await getAccessibleApplication(message.applicationId, socket.user)) {
        message.content = content.trim();
        message.isEdited = true;
        message.editedAt = new Date();
        await message.save();

        io.to(`app_${message.applicationId}`).emit("receive_message", message);
        io.to(`app_${message.applicationId}`).emit("message_edited", message);
        io.emit("conversation_updated", message);
      }
    } catch (error) {
      console.error("Error editing message via socket:", error);
    }
  });

  // Handle deleting a message
  socket.on("delete_message", async (data) => {
    try {
      const { messageId } = data;
      if (!messageId) return;

      const message = await Message.findById(messageId);
      if (message
        && (message.senderId === socket.user?.id || String(socket.user?.role).toUpperCase() === "ADMIN")
        && await getAccessibleApplication(message.applicationId, socket.user)) {
        message.isDeleted = true;
        message.content = "Ce message a été supprimé";
        await message.save();

        io.to(`app_${message.applicationId}`).emit("receive_message", message);
        io.to(`app_${message.applicationId}`).emit("message_deleted", message);
        io.emit("conversation_updated", message);
      }
    } catch (error) {
      console.error("Error deleting message via socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
