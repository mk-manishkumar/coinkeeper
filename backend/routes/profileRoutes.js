import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { displayProfile, addAmount, deleteExpense, deleteAllExpenses, deleteAccount } from "../controllers/profileController.js";

const profileRouter = express.Router();

// Protected routes
profileRouter.use(authMiddleware);

// Get user profile data
profileRouter.get("/:username", displayProfile);

// Add new amount/expense
profileRouter.post("/addamount", addAmount);

// Delete a single expense
profileRouter.delete("/deleteexpense/:expenseId", deleteExpense);

// Delete all expenses
profileRouter.delete("/deleteallexpenses", deleteAllExpenses);

// Delete user account
profileRouter.delete("/deleteaccount", deleteAccount);

export default profileRouter;
