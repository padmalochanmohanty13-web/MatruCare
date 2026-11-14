import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid contact details.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = typeof subject === "string" && subject.trim() ? subject.trim() : "General Enquiry";
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

    if (cleanMessage.length < 5 || cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message must contain at least 5 characters.",
      });
    }

    const recipientEmail = process.env.SMTP_USER || process.env.EMAIL_FROM || "matrucareai@gmail.com";
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!pass) {
      console.warn("Email service is running without configured SMTP_PASS/EMAIL_PASS. Logging message locally.");
      console.log(`Contact message from ${cleanName} (${cleanEmail}): ${cleanSubject} - ${cleanMessage}`);
      return res.status(200).json({
        success: true,
        message: "Your message has been received! Our team will get back to you.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: recipientEmail,
        pass,
      },
    });

    await transporter.sendMail({
      from: {
        name: "MatruCare AI Portal",
        address: process.env.EMAIL_FROM || "matrucareai@gmail.com",
      },
      to: recipientEmail,
      replyTo: cleanEmail,
      subject: `[MatruCare AI] Contact Enquiry: ${cleanSubject}`,
      text: [
        "New contact enquiry received via MatruCare AI Portal.",
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
      message: "Your message has been sent successfully to matrucareai@gmail.com.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
};

export default sendContactMessage;
