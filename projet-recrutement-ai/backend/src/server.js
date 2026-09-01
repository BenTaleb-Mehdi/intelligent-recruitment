import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/adminRoutes.js";
import recruiterRouter from "./routes/recruiter/recruiterRoutes.js";
import jobOfferRouter from "./routes/recruiter/jobOfferRoutes.js";
import dropdownListRouter from "./routes/recruiter/dropdownListRoutes.js";
import candidateRouter from "./routes/candidate/candidateRoutes.js";
// develop merge conflict resolved (deleted some and left what's not mentioned)
import connectMongo from "./config/mongo.js";
import Message from "./models/Message.js";
import userRouter from './routes/user.js';
import messageRouter from './routes/messageRoutes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});
app.set("io", io);

// Connect to MongoDB
connectMongo();

// Middlewares
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"], // Next.js frontend URL
    credentials: true, // Required for cookies/sessions with Better Auth
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

// Socket.IO real-time message handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a specific application chat room
  socket.on("join_room", (applicationId) => {
    socket.join(`app_${applicationId}`);
    console.log(`Socket ${socket.id} joined room: app_${applicationId}`);
  });

  // Handle sending a message
  socket.on("send_message", async (data) => {
    try {
      const { applicationId, senderId, senderRole, senderName, content } = data;

      if (!applicationId || !senderId || !content) {
        return;
      }

      // Save message to MongoDB
      const newMessage = await Message.create({
        applicationId,
        senderId,
        senderRole,
        senderName,
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
      if (message && !message.isDeleted) {
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
      if (message) {
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