const express = require("express");
const amountModel = require("../models/amount.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { getBackgroundColor, calculateTotals } = require("../utils/utils.js");

const router = express.Router();

// to get register page
router.get("/register", (req, res) => {
  const errorMessage = req.flash("error");
  res.render("register", { errorMessage });
});

// for registering
router.post("/register", async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    // Check password length
    if (password.length < 4) {
      req.flash("error", "Password must be at least 4 characters long");
      return res.redirect("/register");
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/register");
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

    req.flash("success", "Registration successful, please login");
    res.redirect("/");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
});

// for login
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ username });
    if (!user) {
      req.flash("error", "User doesn't exist");
      return res.redirect("/");
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid password");
      return res.redirect("/");
    }

    // Login successful
    req.session.user = user;
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/");
  }
});

// add expenses
router.post("/profile", async (req, res) => {
  try {
    const { description, amount, expense } = req.body;

    if (expense === undefined) {
      req.flash("error", "*Enter the expense type");
      return res.redirect("/profile");
    }

    const parsedAmount = +amount;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      req.flash("error", "Amount must be a positive number");
      return res.redirect("/profile");
    }

    const newExpense = await amountModel.create({
      description,
      amount,
      expense,
    });

    res.redirect("/profile");
  } catch (error) {
    req.flash("error", error.message);
    res.status(500).send(error.message);
  }
});

// display all expenses
router.get("/profile", async (req, res) => {
  try {
    const expenses = await amountModel.find();

    let totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    // for each expense
    const totals = calculateTotals(expenses);

    const errorMessage = req.flash("error");

    const fullname = req.userModel ? req.userModel.fullname : "";
    console.log(fullname);

    // Clear flash messages after retrieving them
    req.flash("error", null);

    res.render("index", {
      expenses,
      totalAmount,
      getBackgroundColor,
      savingsTotal: totals.savingsTotal,
      expenditureTotal: totals.expenditureTotal,
      investmentTotal: totals.investmentTotal,
      errorMessage: errorMessage.length > 0 ? errorMessage : null,
      fullname: fullname,
    });
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect("/profile");
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
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.redirect("/");
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.redirect("/");
      }

      res.redirect("/");
    });
  });
});

module.exports = router;
