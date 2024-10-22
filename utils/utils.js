import userModel from "../models/User.model.js";
import amountModel from "../models/Amount.model.js";
import Guest from "../models/Guest.model.js";
import cron from "node-cron";

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

// role selection
export const getUserForRole = async (role, username) => {
  if (role === "guest") {
    return await Guest.findOne({ username });
  } else {
    return await userModel.findOne({ username });
  }
};

// validation for EJS
export const guestRestrictions = (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    res.locals.guestMode = true; // Make guestMode available in all EJS templates
  } else {
    res.locals.guestMode = false; // Explicitly set false for non-guest users
  }
  next();
};

// Schedule job to delete inactive users
export const scheduleUserDeletionJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const currentDate = new Date();
      const hundredDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 100));

      const inactiveUsers = await userModel.find({
        role: { $ne: "guest" },
        lastLogin: { $lt: hundredDaysAgo },
      });

      if (inactiveUsers.length > 0) {
        for (const user of inactiveUsers) {
          await userModel.findByIdAndDelete(user._id);
          console.log(`Deleted user: ${user.username}`);
        }
      }
    } catch (error) {
      console.error("Error deleting inactive users:", error);
    }
  });
};
