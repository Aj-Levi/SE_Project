import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import ConnectDB from "./lib/connectDB.js";
import eventRoutes from "./lib/routes/eventRoutes.js";
import userRoute from "./lib/routes/user.route.js";
import applicationRoute from "./lib/routes/application.route.js";

dotenv.config();

// ✅ Always connect to DB before starting server
await ConnectDB();

const app = express();

// ✅ 1. Global Middlewares
// Use CORS before any route
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, // important if you send cookies
}));

// ✅ 2. Parse cookies (for JWT auth)
app.use(cookieParser());

// ✅ 3. Parse JSON body
app.use(express.json());

// ✅ 4. Mount routes
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoute);
app.use("/api/application", applicationRoute);

// ✅ 5. Optional: Default route or error handler
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ 6. Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
