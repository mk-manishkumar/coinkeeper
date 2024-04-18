const express = require("express");
const amountModel = require("./models/amount.model.js");

const router = express.Router();

// to get background color for each expense
function getBackgroundColor(expenseType) {
  switch (expenseType) {
    case "Savings":
      return "green";
    case "Expenditure":
      return "red";
    case "Investment":
      return "#2A324B";
  }
}

// for calculating total of each expenses
function calculateTotals(expenses) {
  let savingsTotal = 0;
  let expenditureTotal = 0;
  let investmentTotal = 0;

  expenses.forEach((expense) => {
    switch (expense.expense) {
      case "Savings":
        savingsTotal += expense.amount;
        break;
      case "Expenditure":
        expenditureTotal += expense.amount;
        break;
      case "Investment":
        investmentTotal += expense.amount;
        break;
    }
  });

  return {
    savingsTotal: savingsTotal,
    expenditureTotal: expenditureTotal,
    investmentTotal: investmentTotal,
  };
}

// add expenses
router.post("/", async (req, res) => {
  try {
    const { description, amount, expense } = req.body;
    console.log(description, amount, expense);

    if (expense === undefined) {
      return res.send("<b style='font-size: 2rem; text-align: center; font-family: sans-serif;'>Enter the expense type</b>");
    }

    // Convert amount string to number
    const parsedAmount = +amount;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    const newExpense = await amountModel.create({
      description,
      amount,
      expense,
    });

    successRedirect: "/";
    failureRedirect: "/";
    failureFlash: true;
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// display all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await amountModel.find();

    let totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    // for each expenses
    const totals = calculateTotals(expenses);

    res.render("index", {
      expenses,
      totalAmount,
      getBackgroundColor,
      savingsTotal: totals.savingsTotal,
      expenditureTotal: totals.expenditureTotal,
      investmentTotal: totals.investmentTotal,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// clear the database
router.post("/clear-all", async (req, res) => {
  try {
    await amountModel.deleteMany({});

    res.redirect("/");
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

module.exports = router;
