import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMe, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// READ — Profile: GET /api/user/me
router.get("/me", authMiddleware, getMe);

// UPDATE — Profile: PUT /api/user/update
router.put("/update", authMiddleware, updateProfile);

export default router;
