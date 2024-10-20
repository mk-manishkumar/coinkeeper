import User from "../models/User.model.js";
import Guest from "../models/Guest.model.js";
import jwt from "jsonwebtoken";
import { userRegisterSchema } from "../utils/zodValidation.js";
import { hashPassword, comparePassword } from "../utils/passwordBcrypt.js";
import { z } from "zod";
import { nanoid } from "nanoid";

const JWT_SECRET = process.env.JWT_SECRET;
const GUEST_JWT_SECRET = process.env.GUEST_JWT_SECRET;

// registering new account
export const register = async (req, res) => {
  try {
    const { username, fullname, password } = userRegisterSchema.parse(req.body);

    const user = await User.findOne({ username });

    if (user) {
      req.flash("error", "Username already exists");
      return res.status(400).redirect("/");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ username, fullname, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ username: newUser.username, id: newUser._id, role: "user" }, JWT_SECRET, { expiresIn: "30d" });

    res.cookie("token", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); 

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

// check authentication for registeration route
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token || token === "") return res.status(201).render("register", { errorMessage: req.flash() });

    const decoded = jwt.verify(token, JWT_SECRET);

    const username = decoded.username;

    const user = await User.findOne({ username });

    if (!user) return res.send("User doesn't exist");

    return res.status(201).redirect(`/profile/${user.username}`);
  } catch (error) {
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

// check authentication for login page
export const checkLogin = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token || token === "") return res.status(201).render("login", { errorMessage: req.flash() });

    const decoded = jwt.verify(token, JWT_SECRET);

    const username = decoded.username;

    const user = await User.findOne({ username });

    if (!user) return res.send("User doesn't exist");

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

// Guest sign-in logic
export const guestSignIn = async (req, res) => {
  try {
    const username = nanoid();
    const password = Math.random().toString(36).substring(2, 6);

    const hashedPassword = await hashPassword(password);

    const guestUser = new Guest({ username, password: hashedPassword });
    await guestUser.save();

    const token = jwt.sign({ username: guestUser.username, id: guestUser._id, role: "guest" }, GUEST_JWT_SECRET, { expiresIn: "10m" });

    res.cookie("token", token, { httpOnly: true, maxAge: 10 * 60 * 1000 });

    return res.status(201).redirect(`/profile/${guestUser.username}`);
  } catch (err) {
    console.error("Error signing in as guest:", err);
    return res.status(500).render("error", { message: "Internal Server Error" });
  }
};
