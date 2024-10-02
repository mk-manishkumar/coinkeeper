import express from "express";
import Amount from "../models/amount.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRegisterSchema } from "../utils/zodValidation.js";
import { getBackgroundColor, calculateTotals, renderProfileWithError } from "../utils/utils.js";

export const register = async (req, res) => {
  try {
    const { username, name, password } = userRegisterSchema.parse(req.body);

    const user = await User.findOne(username);

    if (user.username) return res.status(501).send("Username already exists");

    // const

    return res.status(201).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
  }
};
