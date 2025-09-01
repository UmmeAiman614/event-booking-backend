export const adminOnly = (req, res, next) => {
  console.log("adminOnly req.user:", req.user); // <- debug
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can view comments" });
  }
  next();
};
