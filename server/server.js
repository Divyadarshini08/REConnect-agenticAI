import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // React dev server
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/alumni", alumniRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});