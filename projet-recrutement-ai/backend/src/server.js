import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/user.js';
import recruiterRouter from './routes/recruiter/recruiterRoutes.js';
import jobOfferRouter from './routes/recruiter/jobOfferRoutes.js';
import dropdownListRouter from './routes/recruiter/dropdownListRoutes.js';
import candidateRouter from './routes/candidate/candidateRoutes.js';
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// Middlewares
const allowedOrigins = [
    "http://localhost:3000",
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
}));
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api", authRouter);
app.use(userRouter);
app.use(recruiterRouter);
app.use(jobOfferRouter);
app.use(dropdownListRouter);
app.use(candidateRouter);
app.use("/api/admin", adminRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});