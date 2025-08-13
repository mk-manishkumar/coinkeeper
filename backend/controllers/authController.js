import User from "../models/User.model.js";
import Guest from "../models/Guest.model.js";
import jwt from "jsonwebtoken";
import { userRegisterSchema } from "../utils/zodValidation.js";
import { hashPassword, comparePassword } from "../utils/passwordBcrypt.js";
import { nanoid } from "nanoid";
import { devLog } from "../utils/consoleLogHelper.js";

const JWT_SECRET = process.env.JWT_SECRET;
const GUEST_JWT_SECRET = process.env.GUEST_JWT_SECRET;

// register a new user
export const register = async (req, res) => {
  try {
    const { username, fullname, password } = userRegisterSchema.parse(req.body);
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, fullname, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ username: newUser.username, id: newUser._id, role: "user" }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({
      username: newUser.username,
      fullname: newUser.fullname,
      role: "user",
      token,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    devLog(error);
    res.status(500).json({ message: "Server error" });
  }
};

// login an existing user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ username: user.username, fullname: user.fullname, id: user._id, role: "user" }, JWT_SECRET, { expiresIn: "30d" });
    res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      role: "user",
      token,
    });

  } catch (error) {
    devLog(error);
    res.status(500).json({ message: "Server error" });
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    const { username, role } = req.user;

    if (role === "guest") await Guest.deleteOne({ username });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// check authentication
export const checkAuth = async (req, res) => {
  try {
    const username = req.user?.username;
    const role = req.user?.role; 

    if (!username || !role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let foundUser;
    let fullname;

    if (role === "user") {
      foundUser = await User.findOne({ username });
      if (!foundUser) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      fullname = foundUser.fullname;
    } 
    else if (role === "guest") {
      foundUser = await Guest.findOne({ username });
      if (!foundUser) {
        return res.status(404).json({ message: "Guest account expired or doesn't exist" });
      }
      fullname = "Guest User"; 
    }

    return res.status(200).json({
      username,
      fullname,
      role
    });

  } catch (error) {
    devLog(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// sign in as guest
export const guestSignIn = async (req, res) => {
  try {
    const username = nanoid();
    const password = Math.random().toString(36).substring(2, 6);
    const hashedPassword = await hashPassword(password);

    const guestUser = new Guest({ username, password: hashedPassword });
    await guestUser.save();

    const token = jwt.sign({ username: guestUser.username, id: guestUser._id, role: "guest" }, GUEST_JWT_SECRET, { expiresIn: "10m" });
    res.status(201).json({ token });
  } catch (error) {
    devLog(error);
    res.status(500).json({ message: "Server error" });
  }
};
