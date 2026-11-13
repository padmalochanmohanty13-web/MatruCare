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
        message: "Enter a valid full name",
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

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (emailError) {
      // Do not leave an account that cannot complete signup.
      await User.deleteOne({ _id: newUser._id });

      console.error("OTP Email Error:", emailError.message);

      return res.status(503).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
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

    console.error("Signup Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error during signup",
    });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate required fields
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

    // 2. Validate six-digit OTP
    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain exactly 6 digits",
      });
    }

    // 3. Find user and explicitly select hidden OTP fields
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otpHash +otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    // 4. Check whether email is already verified
    if (user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // 5. Check whether OTP exists
    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found. Please request a new OTP.",
      });
    }

    // 6. Check OTP expiration
    if (user.otpExpiresAt.getTime() <= Date.now()) {
      user.otpHash = null;
      user.otpExpiresAt = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // 7. Hash entered OTP and compare safely
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

    // 8. Verify email and invalidate OTP
    user.isEmailVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;

    await user.save();

    // 9. Send success response
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

    // 1. Validate email
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user and select hidden OTP fields
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otpHash +otpExpiresAt +otpLastSentAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    // 3. Check email verification status
    if (user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // 4. Enforce 60-second resend cooldown
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

    // 5. Generate a fresh OTP
    const otp = generateOtp();

    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpLastSentAt = new Date();

    // 6. Save new OTP and invalidate previous OTP
    await user.save();

    // 7. Send new OTP email
    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("Resend OTP Email Error:", emailError.message);

      // Clear the undelivered OTP so it cannot be used.
      user.otpHash = null;
      user.otpExpiresAt = null;
      user.otpLastSentAt = null;

      await user.save();

      return res.status(503).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
      });
    }

    // 8. Return success
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

    // 1. Validate required fields
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

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured",
      });
    }

    // 4. Find user and explicitly retrieve hidden password
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        email: user.email,
      });
    }

    // 6. Compare entered password with hashed password
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

    // 7. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 8. Return successful login response
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

