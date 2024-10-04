import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import User from "../models/user.model.js";
import { displayProfile } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);

profileRouter.get("/:username", displayProfile);

export default profileRouter;
