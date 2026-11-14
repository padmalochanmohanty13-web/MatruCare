import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateOtp, hashOtp } from "../utils/generateOtp.js";
import sendOtpEmail from "../services/emailService.js";
import { timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[A-Za-z ]{3,}$/.test(trimmedName)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid full name (minimum 3 characters, letters only)",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOtp();

    const newUser = await User.create({
      fullName: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
      otpHash: hashOtp(otp),
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      otpLastSentAt: new Date(),
    });

    console.log(`[AUTH] User created: ${normalizedEmail}. Dispatching OTP via Nodemailer.`);

    try {
      await sendOtpEmail(normalizedEmail, otp);
      console.log(`[AUTH] OTP email sent successfully to ${normalizedEmail}`);
    } catch (emailError) {
      // Do not leave an unverified account that cannot complete signup.
      await User.deleteOne({ _id: newUser._id });

      console.error("[AUTH] OTP Email delivery failed:", emailError.message);

      return res.status(503).json({
        success: false,
        message: `Unable to send verification email (${emailError.message}). Please verify email credentials.`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email for the OTP.",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    console.error("[AUTH] Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during signup",
    });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !email.trim() ||
      !otp.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const enteredOtp = otp.trim();

    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain exactly 6 digits",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otpHash +otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found. Please request a new OTP.",
      });
    }

    if (user.otpExpiresAt.getTime() <= Date.now()) {
      user.otpHash = null;
      user.otpExpiresAt = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const enteredOtpHash = Buffer.from(hashOtp(enteredOtp), "hex");
    const storedOtpHash = Buffer.from(user.otpHash, "hex");

    if (
      enteredOtpHash.length !== storedOtpHash.length ||
      !timingSafeEqual(enteredOtpHash, storedOtpHash)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    user.isEmailVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error during OTP verification",
    });
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otpHash +otpExpiresAt +otpLastSentAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const cooldown = 60 * 1000;

    if (user.otpLastSentAt) {
      const elapsed = Date.now() - user.otpLastSentAt.getTime();

      if (elapsed < cooldown) {
        const remainingSeconds = Math.ceil(
          (cooldown - elapsed) / 1000
        );

        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
          remainingSeconds,
        });
      }
    }

    const otp = generateOtp();

    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpLastSentAt = new Date();

    await user.save();

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("Resend OTP Email Error:", emailError.message);

      user.otpHash = null;
      user.otpExpiresAt = null;
      user.otpLastSentAt = null;

      await user.save();

      return res.status(503).json({
        success: false,
        message: `Unable to send verification email (${emailError.message}). Please try again.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email address.",
      expiresIn: 600,
      resendCooldown: 60,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while resending OTP",
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        email: user.email,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};
