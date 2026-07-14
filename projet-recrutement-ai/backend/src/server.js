import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/user.js';
import recruiterRouter from './routes/recruiterRoutes.js';
import jobOfferRouter from './routes/jobOfferRoutes.js';
import dropdownListRouter from './routes/dropdownListRoutes.js';

const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:3000", // Next.js frontend URL
    credentials: true, // Required for cookies/sessions with Better Auth
}));
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api", authRouter);
app.use(userRouter);
app.use(recruiterRouter);
app.use(jobOfferRouter);
app.use(dropdownListRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});