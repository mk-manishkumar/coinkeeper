import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { register, login, logout } from "../controllers/authController.js";

const authRouter = express.Router();

// display register page
authRouter.get("/", (req, res) => {
  res.render("register", { errorMessage: req.flash() });
});

// display login page
authRouter.get("/login", (req, res) => {
  res.render("login", { errorMessage: req.flash() });
});

// register logic route
authRouter.post("/", register);

// login logic route
authRouter.post("/login", login);

// Logout route
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
