import express from "express";
import Amount from "../models/amount.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRegisterSchema } from "../utils/zodValidation.js";
import { getBackgroundColor, calculateTotals, renderProfileWithError } from "../utils/utils.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { username, fullname, password } = userRegisterSchema.parse(req.body);

    const user = await User.findOne({ username });
    console.log(user);

    if (user) return res.status(501).send("Username already exists");

    const newUser = new User({ username, fullname, password });
    await newUser.save();

    console.log(newUser);

    const token = jwt.sign({ username: newUser.username, id: newUser._id }, JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).redirect(`/profile/${newUser.username}`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(401).send("Invalid username or password");

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.status(401).send("Invalid username or password");

    const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred during login.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
