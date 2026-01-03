import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

import responseTimeLogger from "./metrics/responseTime.middleware.js";
import intentRoutes from "./routes/intent.routes.js";
import agentRoutes from "./routes/agent.routes.js";



const app = express();
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(cors());
app.use(responseTimeLogger); 
app.use(express.json());



app.use("/api", agentRoutes);
app.use("/api", intentRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/booking", bookingRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
