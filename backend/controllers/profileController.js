import Amount from "../models/Amount.model.js";
import User from "../models/User.model.js";
import Guest from "../models/Guest.model.js";
import { getUserForRole } from "../utils/roles.js";
import { comparePassword } from "../utils/passwordBcrypt.js";
import { devLog } from "../utils/consoleLogHelper.js";

// Display user profile and expenses
export const displayProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const role = req.user?.role || "user";

    const user = await getUserForRole(role, username);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    // Query with userType to ensure we get the right expenses
    const expenses = await Amount.find({
      user: user._id,
      userType: role === "guest" ? "guest" : "user",
    });

    return res.status(200).json({
      fullname: user.fullname || user.name,
      expenses,
    });
  } catch (error) {
    devLog(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new expense
export const addAmount = async (req, res) => {
  try {
    const username = req.user?.username;
    const role = req.user?.role || "user";
    const { description, amount, expense } = req.body;

    const user = await getUserForRole(role, username);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    if (!description || !amount || !expense) {
      return res.status(400).json({ message: "Description, amount, and expense type are required." });
    }

    if (description.length > 20) {
      return res.status(400).json({ message: "Description should be less than 20 characters" });
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a number greater than 0" });
    }

    // Create expense with userType
    const newExpense = new Amount({
      description,
      amount: parsedAmount,
      expense,
      user: user._id,
      userType: role === "guest" ? "guest" : "user",
    });

    await newExpense.save();

    // Update user/guest with new expense ID
    if (role === "guest") {
      await Guest.findByIdAndUpdate(user._id, { $push: { amounts: newExpense._id } });
    } else {
      await User.findByIdAndUpdate(user._id, { $push: { amounts: newExpense._id } });
    }

    return res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    devLog(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a specific expense
export const deleteExpense = async (req, res) => {
  try {
    const username = req.user?.username;
    const role = req.user?.role || "user";
    const expenseId = req.params.expenseId;

    const user = await getUserForRole(role, username);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    // Find expense with userType check for security
    const expense = await Amount.findOne({
      _id: expenseId,
      user: user._id,
      userType: role === "guest" ? "guest" : "user",
    });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    await Amount.findByIdAndDelete(expenseId);

    // Remove from user/guest amounts array
    if (role === "guest") {
      await Guest.findByIdAndUpdate(user._id, { $pull: { amounts: expenseId } });
    } else {
      await User.findByIdAndUpdate(user._id, { $pull: { amounts: expenseId } });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    devLog(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete all expenses for the user
export const deleteAllExpenses = async (req, res) => {
  try {
    const username = req.user?.username;
    const role = req.user?.role || "user";

    const user = await getUserForRole(role, username);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    // Find expenses with userType check
    const expenses = await Amount.find({
      user: user._id,
      userType: role === "guest" ? "guest" : "user",
    });

    const expenseIds = expenses.map((expense) => expense._id);

    await Amount.deleteMany({
      user: user._id,
      userType: role === "guest" ? "guest" : "user",
    });

    // Clear amounts array from user/guest
    if (role === "guest") {
      await Guest.findByIdAndUpdate(user._id, { $pull: { amounts: { $in: expenseIds } } });
    } else {
      await User.findByIdAndUpdate(user._id, { $pull: { amounts: { $in: expenseIds } } });
    }

    return res.status(200).json({ message: "All expenses deleted successfully" });
  } catch (error) {
    devLog(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const username = req.user?.username;
    const role = req.user?.role || "user";

    const user = await getUserForRole(role, username);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // Delete expenses with userType check
    await Amount.deleteMany({
      user: user._id,
      userType: role === "guest" ? "guest" : "user",
    });

    // Delete user/guest
    if (role === "guest") {
      await Guest.deleteOne({ username });
    } else {
      await User.deleteOne({ username });
    }

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    devLog(error);
    return res.status(500).json({ message: "Server error" });
  }
};
