import jwt from "jsonwebtoken";
import { devLog } from "../utils/consoleLogHelper.js";

const JWT_SECRET = process.env.JWT_SECRET;
const GUEST_JWT_SECRET = process.env.GUEST_JWT_SECRET;

if (!JWT_SECRET || !GUEST_JWT_SECRET) {
  console.error("JWT_SECRET or GUEST_JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No Bearer Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Try verifying with the regular user JWT secret
    let decodedValue;
    let role = "user";
    try {
      decodedValue = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // If verification with user secret fails, try guest secret
      decodedValue = jwt.verify(token, GUEST_JWT_SECRET);
      role = "guest";
    }

    if (decodedValue.username) {
      req.user = { username: decodedValue.username, role };
      return next();
    } else {
      return res.status(403).json({ message: "You are not authenticated" });
    }
  } catch (error) {
    devLog(error);
    return res.status(401).json({ message: "Unauthorized - Invalid token", error: error.message });
  }
}
