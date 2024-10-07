import Amount from "../models/amount.model.js";
import User from "../models/user.model.js";
import { getBackgroundColor, calculateTotals, monthYear } from "../utils/utils.js";

// display profile
export const displayProfile = async (req, res) => {
  try {
    const username = req.params;

    const user = await User.findOne(username);
    if (!user) res.send("User doesn't exist");

    const expenses = await Amount.find({ user: user._id });

    let totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    const totals = calculateTotals(expenses);

    console.log(monthYear);

    return res.status(200).render("profile", {
      fullname: user.fullname,
      expenses,
      getBackgroundColor,
      monthYear: monthYear(),
      totalAmount,
      savingsTotal: totals.savingsTotal,
      expenditureTotal: totals.expenditureTotal,
      investmentTotal: totals.investmentTotal,
      errorMessage: "",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// add amount
export const addAmount = async (req, res) => {
  try {
    const username = req.params;
    const { description, amount, expense } = req.body;

    const user = await User.findOne(username);
    if (!user) res.send("User doesn't exist");

    if (isNaN(amount) || amount <= 0) {
      return res.render("profile", {
        errorMessage: "Amount must be a positive number",
      });
    }

    const newExpense = new Amount({ description, amount, expense, user: user._id });
    await newExpense.save();

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
