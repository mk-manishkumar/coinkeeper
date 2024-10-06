import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import User from "../models/user.model.js";
import { displayProfile, addAmount, displayAmount } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);

// route for displaying profile
profileRouter.get("/:username", displayAmount);

// route for adding new amount
profileRouter.post("/addamount", addAmount);

// route for displaying amount
// profileRouter.get("/displayamount", displayAmount);

export default profileRouter;
