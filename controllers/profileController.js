import Amount from "../models/amount.model.js";
import User from "../models/user.model.js";
import { getBackgroundColor, calculateTotals, renderProfileWithError } from "../utils/utils.js";

// display profile
export const displayProfile = async (req, res) => {
  try {
    const username = req.params;

    const user = await User.findOne(username);

    if (!user) res.send("User doesn't exist");

    res.status(200).render("profile", { fullname: user.fullname, totalAmount: 0, savingsTotal: 0, expenditureTotal: 0, investmentTotal: 0 });
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

    const newExpense = new Amount({ description, amount, expense, user: user._id });
    await newExpense.save();

    // res.json({ newExpense });

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// display amount
export const displayAmount = async (req, res) => {
  try {
    const username = req.params;

    const user = await User.findOne(username);
    if (!user) res.send("User doesn't exist");

    const expenses = await Amount.find({ user: user._id });

    return res.status(200).render("profile", { fullname: user.fullname, expenses, totalAmount: 0, savingsTotal: 0, expenditureTotal: 0, investmentTotal: 0 });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
