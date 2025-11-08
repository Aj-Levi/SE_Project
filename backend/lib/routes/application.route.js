import express from "express";
import { generate, getApplications } from "../controller/application.controller.js";
import isAuth from "../middleware/auth.js"
import { validate } from "../controller/application.controller.js";

const router = express.Router();

// POST /api/application/generate
router.post("/generate", isAuth, generate);
router.put("/validate/:id", isAuth, validate);
router.get("/get", isAuth, getApplications);

export default router;
