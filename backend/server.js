import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import { scheduleUserDeletionJob } from "./utils/cronjob.js";

// Import routes
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start background job for user cleanup
scheduleUserDeletionJob();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => res.send("Welcome to Coinkeeper server"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
