import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Next.js frontend URLs
    credentials: true, // Required for cookies/sessions with Better Auth
}));

// Better Auth handler mounted directly on /api/auth/*path for Express 5 compatibility
app.all("/api/auth/*path", toNodeHandler(auth));

app.use(express.json());

// Routes
app.use("/api", authRouter);
app.use(userRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});