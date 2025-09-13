import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authenticateToken from "./middleware/authenticateToken.js";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRouter from "./routes/uploads.js";

// Configure paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from monorepo root if present
const rootEnvPath = path.join(__dirname, '../../.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check and debug routes (no auth required)
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/debug", (_req, res) => res.json({ message: "Debug endpoint working", timestamp: new Date() }));
app.get("/test", (req, res) => {
  res.send("✅ API is up");
});

// Auth middleware for API routes only
app.use("/api", authenticateToken); // Verify tokens and attach user info

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRouter);
// Serve uploads from monorepo root
const uploadsPath = path.join(__dirname, '../../uploads');
app.use("/uploads", express.static(uploadsPath));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("Registered Models:", mongoose.modelNames());

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
