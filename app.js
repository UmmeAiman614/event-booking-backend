import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import frontendRoutes from "./routes/frontendRoutes.js";
import backendRoutes from "./routes/backendRoutes.js";

dotenv.config();

const app = express();

// ✅ Allow both localhost (dev) and Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://event-booking-frontend.vercel.app"  // your deployed frontend URL
  ],
  credentials: true
}));

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", frontendRoutes);
app.use("/api/admin", backendRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Event Booking Backend is running!!!!");
});

// ✅ MongoDB Connection FIRST, then start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

export default app;
