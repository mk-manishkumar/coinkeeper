const express = require("express");
const amountModel = require("../models/amount.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { getBackgroundColor, calculateTotals } = require("../utils/utils.js");
const verifyToken = require("../middlewares/middleware.js");

const router = express.Router();

// to get register page
router.get("/register", (req, res) => {
  res.render("register");
});

// for registering
router.post("/register", async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    // Check password length
    if (password.length < 4) {
      return res.status(400).send("Password must be at least 4 characters long");
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      username,
      fullname,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// for login
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists and the password is correct
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // If authentication is successful, generate a JWT token
    const token = createToken(username, process.env.SECRET_KEY);

    // Redirect to the profile page after successful login
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// add expenses
router.post("/profile", async (req, res) => {
  try {
    const { description, amount, expense } = req.body;

    if (expense === undefined) {
      return res.status(400).send("*Enter the expense type");
    }

    const parsedAmount = +amount;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).send("Amount must be a positive number");
    }

    const newExpense = await amountModel.create({
      description,
      amount,
      expense,
    });

    res.redirect("/profile");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// display all expenses
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      // If user is not authenticated, return an error message
      return res.status(401).send("You must be logged in to view this page");
    }

    const expenses = await amountModel.find();

    let totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    // for each expense
    const totals = calculateTotals(expenses);

    const fullname = req.user.fullname; // Access fullname from req.user

    res.render("index", {
      expenses,
      totalAmount,
      getBackgroundColor,
      savingsTotal: totals.savingsTotal,
      expenditureTotal: totals.expenditureTotal,
      investmentTotal: totals.investmentTotal,
      fullname: fullname,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// clear the database
router.post("/clear-all", async (req, res) => {
  try {
    await amountModel.deleteMany({});

    res.redirect("/profile");
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear database",
    });
  }
});

// delete expense by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await amountModel.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.json({ success: false, message: "Failed to delete expense" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  res.redirect("/");
});

module.exports = router;
