import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { register, login, logout, checkAuth, guestSignIn } from "../controllers/authController.js";

const authRouter = express.Router();

// Check if user is authenticated 
authRouter.get("/check-auth", authMiddleware, checkAuth);

// Register a new user
authRouter.post("/register", register);

// Login an existing user
authRouter.post("/login", login);

// Logout current user
authRouter.post("/logout", authMiddleware, logout);

// Guest Signin (returns guest token)
authRouter.post("/guest-signin", guestSignIn);

export default authRouter;
