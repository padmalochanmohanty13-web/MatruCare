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

// Diagnostic endpoint to test SMTP connectivity on Render
router.get("/smtp", async (req, res) => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || "matrucareai1@gmail.com";
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    await transporter.verify();

    return res.status(200).json({
      success: true,
      message: "SMTP connection to Gmail port 465 succeeded!",
      user,
      hasPass: Boolean(pass),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "SMTP connection failed: " + err.message,
      code: err.code,
      command: err.command,
    });
  }
});

export default router;
