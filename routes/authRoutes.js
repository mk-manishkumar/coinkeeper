import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { register, login, logout } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.render("register");
});

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post("/", register);

authRouter.post("/login", login);

// Logout route
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
