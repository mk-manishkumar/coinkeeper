import express from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { displayProfile, addAmount, deleteExpense, deleteAllExpenses, deleteAccount } from "../controllers/profileController.js";
import { guestRestrictions } from "../utils/utils.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);
profileRouter.use(guestRestrictions);

// route for displaying profile
profileRouter.get("/:username", displayProfile);

// route for adding new amount
profileRouter.post("/addamount", addAmount);

// route for deleting a single expense
profileRouter.post("/deleteexpense/:expenseId", deleteExpense);

// route for deleting all expenses
profileRouter.post("/deleteallexpenses", deleteAllExpenses);

// route for deleting account
profileRouter.post("/deleteaccount", deleteAccount);

export default profileRouter;
