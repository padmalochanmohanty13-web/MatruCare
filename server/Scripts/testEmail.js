
import "dotenv/config";
import {
  verifyEmailConnection,
  sendEmail,
} from "../services/emailService.js";

const testEmail = async () => {
  try {
    console.log("Checking Gmail SMTP connection...");

    await verifyEmailConnection();

    const recipient = process.env.TEST_EMAIL || process.env.SMTP_USER;

    console.log(`Sending test email to ${recipient}...`);

    await sendEmail({
      to: recipient,
      subject: "MatruCare AI - Email Service Test",
      text: "Your MatruCare AI Nodemailer email service is working successfully.",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2>MatruCare AI</h2>
          <p>Your Nodemailer email service is working successfully.</p>
          <p>Sender: MatruCare AI</p>
        </div>
      `,
    });

    console.log("SUCCESS: Test email sent.");
    process.exit(0);
  } catch (error) {
    console.error("EMAIL TEST FAILED:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.message,
    });

    process.exit(1);
  }
};

testEmail();
