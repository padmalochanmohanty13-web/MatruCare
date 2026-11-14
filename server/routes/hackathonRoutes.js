import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerHackathon,
  getMyEntry,
  deleteRegistration,
} from "../controllers/hackathonController.js";

const router = express.Router();

// CREATE — Hackathon: POST /api/hackathon/register
router.post("/register", authMiddleware, registerHackathon);

// READ — My Entry: GET /api/hackathon/my-entry
router.get("/my-entry", authMiddleware, getMyEntry);

// DELETE — Entry: DELETE /api/hackathon/:id
router.delete("/:id", authMiddleware, deleteRegistration);

export default router;
