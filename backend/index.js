import { configDotenv } from "dotenv";
import ConnectDB from "./lib/connectDB.js";

configDotenv();
await ConnectDB();