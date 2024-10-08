import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { userRegisterSchema } from "../utils/zodValidation.js";
import { hashPassword, comparePassword } from "../utils/passwordBcrypt.js";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET;

// registering new account
export const register = async (req, res) => {
  try {
    const { username, fullname, password } = userRegisterSchema.parse(req.body);

    const user = await User.findOne({ username });

    if (!username || !password || !fullname) {
      req.flash("error", "All fields are required.");
      return res.status(400).redirect("/");
    }

    if (user) {
      req.flash("error", "Username already exists");
      return res.status(400).redirect("/");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ username, fullname, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ username: newUser.username, id: newUser._id }, JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).redirect(`/profile/${newUser.username}`);
  } catch (error) {
    // If validation fails, extract error messages
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      req.flash("error", errorMessages);
      return res.status(400).redirect("/");
    }

    // Handle other errors (e.g., database errors)
    console.log(error);
    return res.status(500).render("error");
  }
};

// login into an account
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.status(400).redirect("/login");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      req.flash("error", "Invalid credentials");
      return res.status(400).redirect("/login");
    }

    const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).redirect(`/profile/${user.username}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};

// logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(500).render("error");
  }
};
