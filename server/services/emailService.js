
import nodemailer from "nodemailer";

const SENDER_NAME = "MatruCare AI";

const SENDER_EMAIL =
  process.env.EMAIL_FROM ||
  `${SENDER_NAME} <${process.env.SMTP_USER}>`;

let transporter = null;

// Create Gmail SMTP transporter.
const getTransporter = () => {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, "");

  if (!smtpUser || !smtpPass) {
    throw new Error(
      "Email configuration missing: SMTP_USER and SMTP_PASS are required."
    );
  }

  if (!transporter) {
    const smtpPort = Number(process.env.SMTP_PORT || 465);

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return transporter;
};

// Check Gmail SMTP connection.
export const verifyEmailConnection = async () => {
  try {
    await getTransporter().verify();
    console.log("[EMAIL] Gmail SMTP connection verified.");
    return true;
  } catch (error) {
    console.error("[EMAIL] Gmail SMTP verification failed:", error.message);
    throw error;
  }
};

// Escape HTML to prevent HTML injection.
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

// Shared email sender.
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error(
      "Recipient, subject and email content are required."
    );
  }

  try {
    const mailer = getTransporter();

    const info = await mailer.sendMail({
      from: SENDER_EMAIL,
      to,
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    console.log("[EMAIL] Gmail message sent successfully:", {
      messageId: info.messageId,
      recipient: to,
    });

    return info;
  } catch (error) {
    console.error("[EMAIL] Gmail delivery failed:", {
      code: error.code,
      message: error.message,
    });

    throw error;
  }
};

// 1. OTP verification email.
export const sendOtpEmail = async (email, otp) => {
  const safeOtp = escapeHtml(otp);

  return sendEmail({
    to: email,
    subject: "Your MatruCare AI Verification Code",

    text: [
      "MatruCare AI Email Verification",
      "",
      `Your verification code is: ${otp}`,
      "This code expires in 10 minutes.",
      "It can only be used once.",
      "",
      "If you did not request this code, please ignore this email.",
      "",
      "Regards,",
      SENDER_NAME,
    ].join("\n"),

    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#4338ca;">MatruCare AI</h2>
        <p>Use this 6-digit code to verify your email address.</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:18px;background:#f3f4f6;text-align:center;border-radius:8px;">
          ${safeOtp}
        </div>
        <p>This code expires in <strong>10 minutes</strong> and is valid for one use only.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p>Regards,<br/><strong>MatruCare AI</strong></p>
      </div>
    `,
  });
};

// 2. Hackathon registration confirmation email.
export const sendRegistrationConfirmationEmail = async (registration) => {
  const {
    fullName,
    email,
    mobileNumber,
    collegeName,
    course,
    branch,
    yearOfStudy,
    domain,
    projectName,
    pptLink,
    prototypeLink,
    demoVideoLink,
    teamSize,
    teamMembers = [],
    createdAt,
  } = registration;

  const safe = {
    fullName: escapeHtml(fullName),
    email: escapeHtml(email),
    mobileNumber: escapeHtml(mobileNumber),
    collegeName: escapeHtml(collegeName),
    course: escapeHtml(course),
    branch: escapeHtml(branch),
    yearOfStudy: escapeHtml(yearOfStudy),
    domain: escapeHtml(domain),
    projectName: escapeHtml(projectName),
    pptLink: escapeHtml(pptLink),
    prototypeLink: escapeHtml(prototypeLink),
    demoVideoLink: escapeHtml(demoVideoLink || ""),
    teamSize: escapeHtml(teamSize),
  };

  const safeMembers = teamMembers.map((member) => ({
    fullName: escapeHtml(member.fullName),
    email: escapeHtml(member.email),
  }));

  const memberText = safeMembers.length
    ? safeMembers
        .map(
          (member, index) =>
            `${index + 2}. ${member.fullName} (${member.email})`
        )
        .join("\n")
    : "No additional members. Individual registration.";

  const memberRows = safeMembers.length
    ? safeMembers
        .map(
          (member, index) => `
            <tr>
              <td style="padding:9px;border-bottom:1px solid #e5e7eb;">${index + 2}</td>
              <td style="padding:9px;border-bottom:1px solid #e5e7eb;">${member.fullName}</td>
              <td style="padding:9px;border-bottom:1px solid #e5e7eb;">${member.email}</td>
            </tr>
          `
        )
        .join("")
    : `
        <tr>
          <td colspan="3" style="padding:10px;">Individual registration</td>
        </tr>
      `;

  const registrationDate = createdAt
    ? new Date(createdAt)
    : new Date();

  const formattedDate = registrationDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const text = `
MatruCare AI Hackathon Registration Confirmation

Your registration has been received successfully.

PARTICIPANT DETAILS
Name: ${fullName}
Email: ${email}
Mobile: ${mobileNumber}
College: ${collegeName}
Course: ${course}
Branch: ${branch}
Year: ${yearOfStudy}

PROJECT DETAILS
Domain: ${domain}
Project: ${projectName}
PPT: ${pptLink}
Prototype: ${prototypeLink}
Demo Video: ${demoVideoLink || "Not provided"}

TEAM DETAILS
Team Size: ${teamSize}
1. ${fullName} (Team Lead - ${email})
${memberText}

Registration Date: ${formattedDate}

Regards,
${SENDER_NAME}
  `.trim();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:20px auto;padding:26px;color:#1f2937;border:1px solid #e5e7eb;border-radius:12px;">
      <h1 style="color:#4338ca;text-align:center;">MatruCare AI</h1>
      <h2 style="color:#16a34a;text-align:center;">Registration Confirmed!</h2>

      <p>Hello <strong>${safe.fullName}</strong>,</p>
      <p>Your registration for the MatruCare AI Hackathon has been received successfully.</p>

      <h3>Participant Details</h3>
      <p><strong>Email:</strong> ${safe.email}</p>
      <p><strong>Mobile:</strong> ${safe.mobileNumber}</p>
      <p><strong>College:</strong> ${safe.collegeName}</p>
      <p><strong>Course:</strong> ${safe.course}</p>
      <p><strong>Branch:</strong> ${safe.branch}</p>
      <p><strong>Year:</strong> ${safe.yearOfStudy}</p>

      <h3>Project Details</h3>
      <p><strong>Domain:</strong> ${safe.domain}</p>
      <p><strong>Project:</strong> ${safe.projectName}</p>
      <p><a href="${safe.pptLink}">View Presentation</a></p>
      <p><a href="${safe.prototypeLink}">View Prototype</a></p>
      ${
        safe.demoVideoLink
          ? `<p><a href="${safe.demoVideoLink}">Watch Demo Video</a></p>`
          : "<p>Demo video: Not provided</p>"
      }

      <h3>Team Details (Size: ${safe.teamSize})</h3>
      <table style="width:100%;border-collapse:collapse;text-align:left;">
        <thead>
          <tr>
            <th style="padding:9px;">No.</th>
            <th style="padding:9px;">Name</th>
            <th style="padding:9px;">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:9px;">1 (Lead)</td>
            <td style="padding:9px;">${safe.fullName}</td>
            <td style="padding:9px;">${safe.email}</td>
          </tr>
          ${memberRows}
        </tbody>
      </table>

      <p><strong>Registration Date:</strong> ${escapeHtml(formattedDate)}</p>
      <p>Thank you for participating.</p>
      <p>Regards,<br/><strong>MatruCare AI</strong></p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "MatruCare AI Hackathon - Registration Confirmation",
    text,
    html,
  });
};

// 3. Contact form email.
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return sendEmail({
    to: process.env.CONTACT_EMAIL || "matrucareai1@gmail.com",
    replyTo: email,
    subject: `[MatruCare AI] Contact Enquiry: ${subject}`,

    text: [
      "New contact enquiry received.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n"),

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;">
        <h2>MatruCare AI - Contact Enquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${safeMessage}</p>
      </div>
    `,
  });
};

export default sendOtpEmail;
