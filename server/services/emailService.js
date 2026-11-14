import nodemailer from "nodemailer";

const createTransporter = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || "matrucareai1@gmail.com";
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  // Use service: 'gmail' for fast direct SSL connection (takes ~3s instead of 47s on port 587)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
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

// User Signup (OTP) email
export const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_FROM || "matrucareai@gmail.com";

  await transporter.sendMail({
    from: {
      name: "MatruCare AI",
      address: fromEmail,
    },
    to: email,
    subject: "Your MatruCare AI Verification Code",
    text: `Your MatruCare AI verification OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #4338ca; margin-bottom: 8px;">MatruCare AI</h2>
        <p style="font-size: 15px; color: #374151;">Hello,</p>
        <p style="font-size: 14px; color: #4b5563;">Use the following 6-digit OTP to verify your email address for the <strong>MatruCare AI Hackathon Portal</strong>:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f3f4f6; text-align: center; border-radius: 8px; margin: 20px 0; color: #1e1b4b;">
          ${escapeHtml(otp)}
        </div>
        <p style="font-size: 14px; color: #6b7280;">This OTP is time-limited and expires in <strong>10 minutes</strong>. It will be invalidated after first use.</p>
        <p style="font-size: 14px; color: #6b7280;">If you did not request this verification code, please ignore this email.</p>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
          <p style="margin: 0; font-size: 14px; color: #374151;">Regards,<br/><strong style="color: #4338ca;">MatruCare AI Team</strong></p>
        </div>
      </div>
    `,
  });
};

// Hackathon registration confirmation email
export const sendRegistrationConfirmationEmail = async (registration) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_FROM || "matrucareai@gmail.com";

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
          <td colspan="3" style="padding: 12px; color: #6b7280;">
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
    : new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      });

  const text = `
Hello ${fullName},

Congratulations! Your registration for the MatruCare AI Hackathon 2026 has been successfully received.

EVENT DETAILS
Event: MatruCare AI Hackathon 2026
Domain / Track: ${domain}
Project Name: ${projectName}

PARTICIPANT DETAILS
Participant Name: ${fullName}
Email: ${email}
Mobile Number: ${mobileNumber}
College: ${collegeName}
Course: ${course}
Branch: ${branch}
Year of Study: ${yearOfStudy}

PROJECT RESOURCES
PPT Link: ${pptLink}
Prototype Link: ${prototypeLink}
Demo Video Link: ${demoVideoLink || "Not provided"}

TEAM DETAILS
Team Size: ${teamSize}
Team Members:
1. ${fullName} (Team Lead - ${email})
${teamMembersText}

Registration Date: ${registrationDate}

Please keep this confirmation email for your records.

Regards,
MatruCare AI Team
matrucareai@gmail.com
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; padding: 28px; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 14px;">

      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
        <h1 style="color: #4338ca; margin-bottom: 8px;">MatruCare AI</h1>
        <p style="color: #16a34a; font-size: 18px; font-weight: bold; margin: 0;">
          Hackathon Registration Confirmed!
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">
          MatruCare AI Hackathon 2026
        </p>
      </div>

      <p style="margin-top: 20px; font-size: 15px;">Hello <strong>${safeName}</strong>,</p>

      <p style="font-size: 14px; line-height: 1.6; color: #374151;">
        Congratulations! Your registration for the
        <strong>MatruCare AI Hackathon 2026</strong> has been successfully received.
      </p>

      <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
        <h3 style="color: #166534; margin-top: 0; margin-bottom: 12px;">Participant Details</h3>
        <p style="margin: 6px 0;"><strong>Participant:</strong> ${safeName}</p>
        <p style="margin: 6px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin: 6px 0;"><strong>Mobile:</strong> ${escapeHtml(mobileNumber)}</p>
        <p style="margin: 6px 0;"><strong>College:</strong> ${safeCollege}</p>
        <p style="margin: 6px 0;"><strong>Course:</strong> ${escapeHtml(course)}</p>
        <p style="margin: 6px 0;"><strong>Branch:</strong> ${escapeHtml(branch)}</p>
        <p style="margin: 6px 0;"><strong>Year:</strong> ${escapeHtml(yearOfStudy)}</p>
      </div>

      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <h3 style="color: #4338ca; margin-top: 0; margin-bottom: 12px;">Project Details</h3>
        <p style="margin: 6px 0;"><strong>Domain / Track:</strong> ${safeDomain}</p>
        <p style="margin: 6px 0;"><strong>Project Name:</strong> ${safeProjectName}</p>
        <p style="margin: 6px 0;">
          <strong>PPT Link:</strong>
          <a href="${escapeHtml(pptLink)}" style="color: #4f46e5; text-decoration: underline;" target="_blank">View Presentation</a>
        </p>
        <p style="margin: 6px 0;">
          <strong>Prototype Link:</strong>
          <a href="${escapeHtml(prototypeLink)}" style="color: #4f46e5; text-decoration: underline;" target="_blank">View Prototype</a>
        </p>
        ${
          demoVideoLink
            ? `<p style="margin: 6px 0;"><strong>Demo Video:</strong> <a href="${escapeHtml(demoVideoLink)}" style="color: #4f46e5; text-decoration: underline;" target="_blank">Watch Video</a></p>`
            : '<p style="margin: 6px 0;"><strong>Demo Video:</strong> Not provided</p>'
        }
      </div>

      <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937; margin-bottom: 12px;">Team Details (Size: ${escapeHtml(teamSize)})</h3>

        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">No.</th>
              <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Name</th>
              <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">1 (Lead)</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safeName}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(email)}</td>
            </tr>
            ${teamMembersHtml}
          </tbody>
        </table>
      </div>

      <p style="font-size: 14px; color: #4b5563;"><strong>Registration Date:</strong> ${escapeHtml(registrationDate)}</p>

      <p style="font-size: 14px; color: #4b5563;">
        Please keep this confirmation email for your records. We look forward to seeing your project in action!
      </p>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
        <p style="margin: 0; font-size: 14px; color: #4b5563;">Regards,</p>
        <strong style="color: #4338ca; font-size: 15px;">MatruCare AI Team</strong><br/>
        <span style="font-size: 13px; color: #6b7280;">matrucareai@gmail.com</span>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from: {
      name: "MatruCare AI",
      address: fromEmail,
    },
    to: email,
    subject: "MatruCare AI Hackathon - Registration Confirmation",
    text,
    html,
  });
};

export default sendOtpEmail;
