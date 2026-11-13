
import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Escape user-provided values before inserting them into HTML.
const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

// Existing OTP email functionality
const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: {
      name: "Code-a-Nova",
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: "Your Code-a-Nova Verification Code",
    text: `Your Code-a-Nova verification OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #4338ca;">Code-a-Nova</h2>
        <p>Hello,</p>
        <p>Use the following OTP to verify your email address:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f3f4f6; text-align: center; border-radius: 8px;">
          ${escapeHtml(otp)}
        </div>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p>Regards,<br/>Code-a-Nova Team</p>
      </div>
    `,
  });
};

// New hackathon registration confirmation email
export const sendRegistrationConfirmationEmail = async (registration) => {
  const transporter = createTransporter();

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

  const safeName = escapeHtml(fullName);
  const safeDomain = escapeHtml(domain);
  const safeProjectName = escapeHtml(projectName);
  const safeCollege = escapeHtml(collegeName);

  const teamMembersText =
    teamMembers.length > 0
      ? teamMembers
          .map(
            (member, index) =>
              `${index + 2}. ${member.fullName} (${member.email})`
          )
          .join("\n")
      : "No additional team members. Individual registration.";

  const teamMembersHtml =
    teamMembers.length > 0
      ? teamMembers
          .map(
            (member, index) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                  ${index + 2}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                  ${escapeHtml(member.fullName)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                  ${escapeHtml(member.email)}
                </td>
              </tr>
            `
          )
          .join("")
      : `
        <tr>
          <td colspan="3" style="padding: 12px;">
            Individual registration – no additional team members.
          </td>
        </tr>
      `;

  const registrationDate = createdAt
    ? new Date(createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      })
    : "Not available";

  const text = `
Hello ${fullName},

Congratulations! Your Code-a-Nova Hackathon registration has been successfully received.

REGISTRATION DETAILS

Participant: ${fullName}
Email: ${email}
Mobile: ${mobileNumber}
College: ${collegeName}
Course: ${course}
Branch: ${branch}
Year of Study: ${yearOfStudy}

PROJECT DETAILS

Domain: ${domain}
Project Name: ${projectName}
PPT: ${pptLink}
Prototype: ${prototypeLink}
Demo Video: ${demoVideoLink || "Not provided"}

TEAM DETAILS

Team Size: ${teamSize}
${teamMembersText}

Registration Date: ${registrationDate}

Please keep this email for your records.

Regards,
Code-a-Nova Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; padding: 28px; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 14px;">

      <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #4338ca; margin-bottom: 8px;">Code-a-Nova</h1>
        <p style="color: #16a34a; font-size: 18px; font-weight: bold;">
          Registration Confirmed!
        </p>
      </div>

      <p>Hello <strong>${safeName}</strong>,</p>

      <p>
        Congratulations! Your registration for the
        <strong>Code-a-Nova Hackathon</strong> has been successfully received.
      </p>

      <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #166534; margin-top: 0;">Registration Details</h3>
        <p><strong>Participant:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(mobileNumber)}</p>
        <p><strong>College:</strong> ${safeCollege}</p>
        <p><strong>Course:</strong> ${escapeHtml(course)}</p>
        <p><strong>Branch:</strong> ${escapeHtml(branch)}</p>
        <p><strong>Year:</strong> ${escapeHtml(yearOfStudy)}</p>
      </div>

      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #4338ca; margin-top: 0;">Project Details</h3>
        <p><strong>Domain:</strong> ${safeDomain}</p>
        <p><strong>Project Name:</strong> ${safeProjectName}</p>
        <p>
          <strong>PPT:</strong>
          <a href="${escapeHtml(pptLink)}">View Presentation</a>
        </p>
        <p>
          <strong>Prototype:</strong>
          <a href="${escapeHtml(prototypeLink)}">View Prototype</a>
        </p>
        ${
          demoVideoLink
            ? `<p><strong>Demo Video:</strong> <a href="${escapeHtml(demoVideoLink)}">Watch Video</a></p>`
            : "<p><strong>Demo Video:</strong> Not provided</p>"
        }
      </div>

      <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Team Details</h3>
        <p><strong>Team Size:</strong> ${escapeHtml(teamSize)}</p>

        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px;">No.</th>
              <th style="padding: 10px;">Name</th>
              <th style="padding: 10px;">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">1</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safeName}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(email)}</td>
            </tr>
            ${teamMembersHtml}
          </tbody>
        </table>
      </div>

      <p><strong>Registration Date:</strong> ${escapeHtml(registrationDate)}</p>

      <p>
        Please keep this email for your records. Thank you for registering
        with Code-a-Nova!
      </p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
        <p style="margin-bottom: 4px;">Regards,</p>
        <strong style="color: #4338ca;">Code-a-Nova Team</strong>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from: {
      name: "Code-a-Nova",
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: "Code-a-Nova Hackathon – Registration Confirmation",
    text,
    html,
  });
};

export default sendOtpEmail;
