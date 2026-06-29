import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:3000", // Next.js frontend URL
    credentials: true, // Required for cookies/sessions with Better Auth
}));
app.use(express.json());

// Routes
app.use("/api", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});