
import { sendContactEmail } from "../services/emailService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\p{L}][\p{L}\s'-]*$/u;

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validate input types.
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid name, email, and message.",
      });
    }

    if (subject !== undefined && typeof subject !== "string") {
      return res.status(400).json({
        success: false,
        message: "Subject must be a valid text value.",
      });
    }

    // 2. Normalize input.
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject?.trim() || "General Enquiry";
    const cleanMessage = message.trim();

    // 3. Validate name.
    if (
      cleanName.length < 2 ||
      cleanName.length > 80 ||
      !NAME_REGEX.test(cleanName)
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must contain 2 to 80 valid characters.",
      });
    }

    // 4. Validate email.
    if (
      cleanEmail.length > 254 ||
      !EMAIL_REGEX.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 5. Validate subject.
    if (
      cleanSubject.length > 150 ||
      /[\r\n]/.test(cleanSubject)
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject cannot exceed 150 characters or contain line breaks.",
      });
    }

    // 6. Validate message.
    if (cleanMessage.length < 5 || cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message must contain 5 to 3000 characters.",
      });
    }

    // 7. Send contact email using the shared Nodemailer service.
    await sendContactEmail({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    console.log(`[CONTACT] Message successfully sent from ${cleanEmail}`);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    // Do not expose SMTP credentials or internal errors to the client.
    console.error("[CONTACT] Email delivery failed:", {
      code: error.code,
      message: error.message,
    });

    return res.status(503).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
};

export default sendContactMessage;
