
import express from "express";

import {
  signup,
  verifyOtp,
   resendOtp,
   login,
} from "../controllers/authController.js";

const router = express.Router();

// Signup API
router.post("/signup", signup);

// OTP Verification API
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// User login
router.post("/login", login);

export default router;
