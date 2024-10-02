import express from "express";
import amountModel from "../models/amount.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getBackgroundColor, calculateTotals, renderProfileWithError } from "../utils/utils.js";
import { verifyToken } from "../middlewares/middleware.js";

const router = express.Router();

// to get register page
router.get("/register", (req, res) => {
  res.render("register");
});

// for registering
router.post("/register", async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    if (password.length < 4) {
      return res.redirect("/register?errorMessage=" + encodeURIComponent("Password must be at least 4 characters long"));
    }

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.redirect("/register?errorMessage=" + encodeURIComponent("Username already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      fullname,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/register?errorMessage=" + encodeURIComponent("Internal Server Error"));
  }
});

// for login
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    if (!user) {
      return res.redirect("/?errorMessage=" + encodeURIComponent("Invalid Username"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/?errorMessage=" + encodeURIComponent("Invalid Password"));
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.redirect(`/profile?username=${username}`);
  } catch (error) {
    console.log(error);
    res.redirect("/?errorMessage=" + encodeURIComponent("Internal Server Error"));
  }
});

// add expenses
router.post("/profile", verifyToken, async (req, res) => {
  try {
    const { description, amount, expense } = req.body;

    if (expense === undefined) {
      return res.redirect("/profile?errorMessage=" + encodeURIComponent("Enter the expense type"));
    }

    const parsedAmount = +amount;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.redirect("/profile?errorMessage=" + encodeURIComponent("Amount must be a positive number"));
    }

    const user = await userModel.findOne({ username: req.username }); // Get user

    await amountModel.create({
      description,
      amount,
      expense,
      user: user._id,
    });

    res.redirect("/profile");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// display all expenses
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const errorMessage = req.query.errorMessage || "";

    if (!username) {
      return res.status(401).send("You must be logged in to view this page");
    }

    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).send("User not found");
    }

    const expenses = await amountModel.find({ user: user._id });

    let totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    const totals = calculateTotals(expenses);

    res.render("index", {
      expenses,
      totalAmount,
      getBackgroundColor,
      savingsTotal: totals.savingsTotal,
      expenditureTotal: totals.expenditureTotal,
      investmentTotal: totals.investmentTotal,
      fullname: user.fullname,
      errorMessage: errorMessage,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// clear the database
router.post("/clear-all", verifyToken, async (req, res) => {
  try {
    // Find the user by username
    const user = await userModel.findOne({ username: req.username });

    if (!user) {
      return res.status(401).send("User not found");
    }

    // Delete all amounts for the user
    await amountModel.deleteMany({ user: user._id });

    // Clear the user's amounts array
    user.amounts = [];
    await user.save();

    // Redirect to the profile page
    res.redirect("/profile");
  } catch (error) {
    console.error("Failed to clear database:", error);
    res.status(500).json({
      message: "Failed to clear database",
    });
  }
});

// delete expense by ID
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await amountModel.findOneAndDelete({ _id: id });

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.json({ success: false, message: "Failed to delete expense" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
