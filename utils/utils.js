const userModel = require("../models/user.model.js");
const amountModel = require("../models/amount.model.js");

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

// Helper function to render profile with error
async function renderProfileWithError(res, username, errorMessage) {
  const user = await userModel.findOne({ username });
  const expenses = await amountModel.find({ user: user._id });
  const totals = calculateTotals(expenses);
  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  res.render("index", {
    expenses,
    totalAmount,
    getBackgroundColor,
    savingsTotal: totals.savingsTotal,
    expenditureTotal: totals.expenditureTotal,
    investmentTotal: totals.investmentTotal,
    fullname: user.fullname,
    errorMessage,
  });
}

module.exports = {
  getBackgroundColor,
  calculateTotals,
  renderProfileWithError,
};
