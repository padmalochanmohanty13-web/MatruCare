
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { timingSafeEqual } from "crypto";

import User from "../models/User.js";
import { generateOtp, hashOtp } from "../utils/generateOtp.js";
import sendOtpEmail from "../services/emailService.js";

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const JWT_EXPIRY = "1d";

// Normalize email addresses consistently.
const normalizeEmail = (email) => email.trim().toLowerCase();

// Validate email format.
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Compare OTP hashes safely.
const isOtpMatching = (enteredOtp, storedOtpHash) => {
  try {
    const enteredHash = Buffer.from(hashOtp(enteredOtp), "hex");
    const storedHash = Buffer.from(storedOtpHash, "hex");

    if (enteredHash.length !== storedHash.length) {
      return false;
    }

    return timingSafeEqual(enteredHash, storedHash);
  } catch {
    return false;
  }
};

// POST /api/auth/signup
// Create an account and send a verification OTP.
export const signup = async (req, res) => {
  let createdUser = null;

  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Required field validation.
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const trimmedName = fullName.trim();
    const normalizedEmail = normalizeEmail(email);

    // Name validation.
    if (!/^[A-Za-z ]{3,80}$/.test(trimmedName)) {
      return res.status(400).json({
        success: false,
        message:
          "Full name must contain 3 to 80 characters and letters only.",
      });
    }

    // Email validation.
    if (
      normalizedEmail.length > 254 ||
      !isValidEmail(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password validation.
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 72 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Check whether the account already exists.
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.isEmailVerified
          ? "An account with this email already exists. Please log in."
          : "An unverified account already exists. Please request a new OTP.",
      });
    }

    // Hash password before storing it.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a cryptographically secure six-digit OTP.
    const otp = generateOtp();

    const otpHash = hashOtp(otp);

    const otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    // Create an unverified account.
    createdUser = await User.create({
      fullName: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
      otpHash,
      otpExpiresAt,
      otpLastSentAt: new Date(),
    });

    console.log("[AUTH] Unverified account created:", normalizedEmail);

    // Send OTP through the shared Nodemailer service.
    try {
      await sendOtpEmail(normalizedEmail, otp);

      console.log("[AUTH] Verification email sent:", normalizedEmail);
    } catch (emailError) {
      console.error("[AUTH] OTP email delivery failed:", {
        code: emailError.code,
        message: emailError.message,
      });

      // Remove the unverified account if the initial email fails.
      await User.deleteOne({
        _id: createdUser._id,
        isEmailVerified: false,
      });

      return res.status(503).json({
        success: false,
        message:
          "Unable to send the verification email. Please try again later.",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. A 6-digit OTP has been sent to your email.",
      user: {
        id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
        isEmailVerified: createdUser.isEmailVerified,
      },
      expiresIn: OTP_EXPIRY_MINUTES * 60,
      resendCooldown: OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    // Handle MongoDB duplicate email errors.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("[AUTH] Signup error:", error.message);

    // Clean up an account created before an unexpected failure.
    if (createdUser) {
      try {
        await User.deleteOne({
          _id: createdUser._id,
          isEmailVerified: false,
        });
      } catch (cleanupError) {
        console.error(
          "[AUTH] Failed to clean up unverified account:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create your account. Please try again.",
    });
  }
};

// POST /api/auth/verify-otp
// Verify OTP, activate the account and invalidate the OTP.
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
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const enteredOtp = otp.trim();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain exactly 6 digits.",
      });
    }

    // Retrieve hidden OTP fields.
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otpHash +otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified. Please log in.",
      });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found. Please request a new OTP.",
      });
    }

    // Check expiration.
    if (user.otpExpiresAt.getTime() <= Date.now()) {
      user.otpHash = undefined;
      user.otpExpiresAt = undefined;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Compare the entered OTP with the stored hash.
    const isValidOtp = isOtpMatching(
      enteredOtp,
      user.otpHash
    );

    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Activate account and invalidate OTP after successful use.
    user.isEmailVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpLastSentAt = undefined;

    await user.save();

    console.log("[AUTH] Email verified successfully:", normalizedEmail);

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
    console.error("[AUTH] OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP. Please try again.",
    });
  }
};

// POST /api/auth/resend-otp
// Generate and send a new OTP with a 60-second cooldown.
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otpHash +otpExpiresAt +otpLastSentAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    // Enforce resend cooldown.
    if (user.otpLastSentAt) {
      const elapsed =
        Date.now() - user.otpLastSentAt.getTime();

      const cooldownMs =
        OTP_RESEND_COOLDOWN_SECONDS * 1000;

      if (elapsed < cooldownMs) {
        const remainingSeconds = Math.ceil(
          (cooldownMs - elapsed) / 1000
        );

        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
          remainingSeconds,
        });
      }
    }

    // Keep previous OTP state so a failed email does not invalidate it.
    const previousOtpHash = user.otpHash;
    const previousOtpExpiresAt = user.otpExpiresAt;
    const previousOtpLastSentAt = user.otpLastSentAt;

    const newOtp = generateOtp();

    user.otpHash = hashOtp(newOtp);
    user.otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );
    user.otpLastSentAt = new Date();

    await user.save();

    // Send the new OTP.
    try {
      await sendOtpEmail(normalizedEmail, newOtp);

      console.log("[AUTH] Resend OTP email sent:", normalizedEmail);
    } catch (emailError) {
      console.error("[AUTH] Resend email delivery failed:", {
        code: emailError.code,
        message: emailError.message,
      });

      // Restore the previously active OTP if sending failed.
      user.otpHash = previousOtpHash;
      user.otpExpiresAt = previousOtpExpiresAt;
      user.otpLastSentAt = previousOtpLastSentAt;

      await user.save();

      return res.status(503).json({
        success: false,
        message:
          "Unable to send a new verification email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email address.",
      expiresIn: OTP_EXPIRY_MINUTES * 60,
      resendCooldown: OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    console.error("[AUTH] Resend OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to resend OTP. Please try again.",
    });
  }
};

// POST /api/auth/login
// Authenticate verified users and issue a JWT.
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
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[AUTH] JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    // Password is excluded by default in the User model.
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Only verified accounts can log in.
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        email: user.email,
      });
    }

    // Compare entered password with the stored bcrypt hash.
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT.
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );

    console.log("[AUTH] Login successful:", normalizedEmail);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      expiresIn: JWT_EXPIRY,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
};
