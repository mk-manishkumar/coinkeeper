import Amount from "../models/amount.model.js";
import User from "../models/user.model.js";
import { getBackgroundColor, calculateTotals, monthYear } from "../utils/utils.js";

// display profile
export const displayProfile = async (req, res) => {
  try {
    const username = req.username;

    const user = await User.findOne({ username });
    if (!user) res.send("User doesn't exist");

    const expenses = await Amount.find({ user: user._id });

    let totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    const totals = calculateTotals(expenses);

    return res.status(200).render("profile", {
      fullname: user.fullname,
      expenses,
      getBackgroundColor,
      monthYear: monthYear(),
      totalAmount,
      savingsTotal: totals.savingsTotal,
      expenditureTotal: totals.expenditureTotal,
      investmentTotal: totals.investmentTotal,
      errorMessage: req.flash(),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};

// add amount
export const addAmount = async (req, res) => {
  try {
    const username = req.username;

    const { description, amount, expense } = req.body;

    const user = await User.findOne({ username });
    if (!user) res.send("User doesn't exist");

    if (expense === undefined) {
      req.flash("error", "Please select type of expense");
      return res.status(511).redirect(`/profile/${user.username}`);
    }

    if (!description || !amount) {
      req.flash("error", "Description and Amount are required");
      return res.status(511).redirect(`/profile/${user.username}`);
    }

    if (description.length > 20) {
      req.flash("error", "Description should be less than 20 characters");
      return res.status(511).redirect(`/profile/${user.username}`);
    }

    let parsedAmount = parseInt(amount, 10);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      req.flash("error", "Please enter a number greater than 0");
      return res.status(511).redirect(`/profile/${user.username}`);
    }

    const newExpense = new Amount({ description, amount, expense, user: user._id });
    await newExpense.save();

    await User.findByIdAndUpdate(user._id, { $push: { amounts: newExpense._id } });

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};

// delete single expense
export const deleteExpense = async (req, res) => {
  try {
    const username = req.username;
    const expenseId = req.params.expenseId;

    const user = await User.findOne({ username });
    if (!user) res.send("User doesn't exist");

    const expense = await Amount.findById(expenseId);
    if (!expense) return res.status(404).send("Expense not found");

    await Amount.findByIdAndDelete(expenseId);

    await User.findByIdAndUpdate(user._id, { $pull: { amounts: expenseId } });

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};

// delete all expenses
export const deleteAllExpenses = async (req, res) => {
  try {
    const username = req.username;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("User doesn't exist");

    const expenses = await Amount.find({ user: user._id });
    const expenseIds = expenses.map((expense) => expense._id);

    await Amount.deleteMany({ user: user._id });

    await User.findByIdAndUpdate(user._id, { $pull: { amounts: { $in: expenseIds } } });

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};
