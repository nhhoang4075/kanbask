import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

export const authorizeUserOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.userId === req.params.userId) {
    return next();
  }
  res.status(403).json({ success: false, message: "Access denied." });
};