import userModel from "../models/User.model.js";
import amountModel from "../models/Amount.model.js";

// Get background color for each expense type
export function getBackgroundColor(expenseType) {
  switch (expenseType) {
    case "Savings":
      return "green";
    case "Expenditure":
      return "red";
    case "Investment":
      return "#2A324B";
    default:
      return "black";
  }
}

// Calculate total of each expense type
export function calculateTotals(expenses) {
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
      default:
        console.warn(`Unknown expense type: ${expense.expense}`);
    }
  });

  return {
    savingsTotal,
    expenditureTotal,
    investmentTotal,
  };
}

// Helper function to render profile with error
export async function renderProfileWithError(res, username, errorMessage) {
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

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
  } catch (error) {
    console.error("Error rendering profile:", error);
    res.status(500).send("Internal Server Error");
  }
}

// to display month and year
export function monthYear() {
  try {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    const year = currentDate.getFullYear();

    const currentMonthYear = `${month} ${year}`;
    return currentMonthYear;
  } catch (error) {
    console.log(error);
  }
}
