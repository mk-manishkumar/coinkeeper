const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

// Function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token not provided" });
  }

  try {
    const decodedValue = jwt.verify(token, JWT_SECRET);
    if (decodedValue.username) {
      req.username = decodedValue.username;
      next();
    } else {
      res.status(403).json({ message: "You are not authenticated" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

module.exports = verifyToken;
