import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
// Routes
import authRoutes from "./routes/authRoutes.js";
import frontendRoutes from "./routes/frontendRoutes.js";
import backendRoutes from "./routes/backendRoutes.js";

dotenv.config();

// ...
dotenv.config();

const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://event-booking-frontend-kappa.vercel.app",
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        console.warn(`🚫 CORS blocked: ${origin}`);
        const msg = `The CORS policy does not allow access from ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // for form-data
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
// Log every request hitting the backend
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.originalUrl}`);
  next();
});
// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api", frontendRoutes);
app.use("/api/admin", backendRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Event Booking Backend is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Optional: Mongoose logs
import mongoose from "mongoose";
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection is active");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

export default app;
