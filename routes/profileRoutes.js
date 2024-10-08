import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { displayProfile, addAmount, deleteExpense, deleteAllExpenses } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);

// route for displaying profile
profileRouter.get("/:username", displayProfile);

// route for adding new amount
profileRouter.post("/addamount", addAmount);

// route for deleting a single expense
profileRouter.post("/deleteexpense/:expenseId", deleteExpense);

// route for deleting all expenses
profileRouter.post("/deleteallexpenses", deleteAllExpenses);

export default profileRouter;
