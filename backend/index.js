import express from "express";
import cors from "cors";
import eventRoutes from "./lib/routes/eventRoutes.js";
import { configDotenv } from "dotenv";
import ConnectDB from "./lib/connectDB.js";

configDotenv();
await ConnectDB();

const app = express();
app.use(cors()); // ← add this
app.use(express.json());
app.use("/api/events", eventRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
