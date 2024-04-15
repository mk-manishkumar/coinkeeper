const express = require("express");
const amountModel = require("./models/amount.model.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { description, amount, expense } = req.body;
    console.log(description, amount, expense);

    // Convert amount string to number
    const parsedAmount = +amount;

    // Validate amount
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

    res.redirect("/");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
