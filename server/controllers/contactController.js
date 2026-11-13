
import nodemailer from "nodemailer";

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid contact details.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must contain 2 to 80 characters.",
      });
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (cleanSubject.length < 3 || cleanSubject.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Subject must contain 3 to 120 characters.",
      });
    }

    if (cleanMessage.length < 10 || cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message must contain 10 to 3000 characters.",
      });
    }

    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.EMAIL_FROM
    ) {
      console.error("Contact email configuration is incomplete.");

      return res.status(500).json({
        success: false,
        message: "Email service is temporarily unavailable.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: {
        name: "Code-a-Nova",
        address: process.env.EMAIL_FROM,
      },
      to: process.env.SMTP_USER,
      replyTo: cleanEmail,
      subject: `Contact Enquiry: ${cleanSubject}`,
      text: [
        "New contact enquiry from Code-a-Nova.",
        "",
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Subject: ${cleanSubject}`,
        "",
        "Message:",
        cleanMessage,
      ].join("\n"),
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again later.",
    });
  }
};

export { sendContactMessage };
