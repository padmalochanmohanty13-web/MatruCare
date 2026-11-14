import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MatruCare AI API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic endpoint to test SMTP connectivity
router.get("/smtp", async (req, res) => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || "matrucareai1@gmail.com";
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || "edsoomvryczrnquk";

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    await transporter.verify();

    return res.status(200).json({
      success: true,
      message: "Simple Nodemailer Gmail connection verified successfully!",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `SMTP connection failed: ${err.message}`,
      code: err.code,
      command: err.command,
    });
  }
});

export default router;
