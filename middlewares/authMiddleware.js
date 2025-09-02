// middleware/protect.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("🔑 Incoming token:", token.slice(0, 20) + "...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ JWT decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error("❌ User not found for token id:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } catch (err) {
      console.error("❌ protect error:", err.message);
      return res
        .status(401)
        .json({ message: "Not authorized, token invalid" });
    }
  }

  console.warn("⚠️ No token provided in request headers");
  return res.status(401).json({ message: "Not authorized, no token" });
};

// adminOnly.js (simplified)
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
