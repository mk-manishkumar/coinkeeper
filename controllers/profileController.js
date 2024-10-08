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
    const username = req.username;

    const { description, amount, expense } = req.body;

    const user = await User.findOne({ username });
    if (!user) res.send("User doesn't exist");

    const newExpense = new Amount({ description, amount, expense, user: user._id });
    await newExpense.save();

    await User.findByIdAndUpdate(user._id, { $push: { amounts: newExpense._id } });

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    res.send(error);
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
    res.send(error);
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
    res.status(500).send(error);
  }
};
