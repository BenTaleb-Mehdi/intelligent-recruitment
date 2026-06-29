import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();

// Middlwares 3adiyin
app.use(cors({
    origin: "http://localhost:3000", // URL dyal React Frontend dyalk
    credentials: true // mhm bzaf f l-Auth 3la kbal cookies/sessions
}));
app.use(express.json());

// N-khdmo b routes dyalna
app.use("/api", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server runing on http://localhost:${PORT}`);
});