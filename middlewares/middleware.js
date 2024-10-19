import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const GUEST_JWT_SECRET = process.env.GUEST_JWT_SECRET;

if (!JWT_SECRET || !GUEST_JWT_SECRET) {
  console.error("JWT_SECRET or GUEST_JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token not provided" });
  }

  try {
    // Try verifying with the regular user JWT secret
    const decodedValue = jwt.verify(token, JWT_SECRET);

    if (decodedValue.username) {
      req.username = decodedValue.username;
      req.role = "user";
      next();
    } else {
      res.status(403).json({ message: "You are not authenticated" });
    }
  } catch (error) {
    // If regular token verification fails, try verifying with guest secret
    try {
      const decodedGuestValue = jwt.verify(token, GUEST_JWT_SECRET);

      req.username = decodedGuestValue.username;
      req.role = "guest";
      next();
    } catch (guestError) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  }
}
