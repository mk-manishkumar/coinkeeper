const jwt = require("jsonwebtoken");


// Function to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Set req.user with decoded user information
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).send("Forbidden");
  }
};

module.exports = verifyToken;
