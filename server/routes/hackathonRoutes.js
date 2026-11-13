
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerHackathon,
  getMyEntry,
} from "../controllers/hackathonController.js";

const router = express.Router();

// Register for the hackathon
router.post("/register", authMiddleware, registerHackathon);

// Get the logged-in user's registration
router.get("/my-entry", authMiddleware, getMyEntry);

export default router;
