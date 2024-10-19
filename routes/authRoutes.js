import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { register, login, logout, checkAuth, checkLogin, guestSignIn } from "../controllers/authController.js";

const authRouter = express.Router();

// display register page
authRouter.get("/", checkAuth);

// display login page
authRouter.get("/login", checkLogin);

// register logic route
authRouter.post("/", register);

// login logic route
authRouter.post("/login", login);

// Logout route
authRouter.post("/logout", authMiddleware, logout);

// guest signin
authRouter.get("/guest-signin", guestSignIn);

export default authRouter;
