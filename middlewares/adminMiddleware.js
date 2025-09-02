import { protect } from "./authMiddleware.js";

export const adminOnly = async (req, res, next) => {
  try {
    // ✅ run protect first
    await protect(req, res, async (err) => {
      if (err) return; // protect already handled error response

      // ✅ check admin role
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied: Admins only" });
      }

      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Admin authorization failed" });
  }
};
