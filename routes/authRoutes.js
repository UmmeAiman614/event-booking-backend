import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// ================== Auth Routes ==================

// Register a new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Logout user
router.post("/logout", authController.logout);

export default router;
