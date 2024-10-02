import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.render("register");
});

// Logout route
// authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
