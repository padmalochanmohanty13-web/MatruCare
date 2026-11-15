
import mongoose from "mongoose";
import HackathonRegistration from "../models/HackathonRegistration.js";
import User from "../models/User.js";
import {
  sendRegistrationConfirmationEmail,
} from "../services/emailService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\p{L}][\p{L}\s'-]*$/u;

const isValidHttpUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value.trim());

    return (
      ["http:", "https:"].includes(url.protocol) &&
      Boolean(url.hostname) &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
};

const isValidName = (value, min = 3, max = 80) => {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.trim().length <= max &&
    NAME_REGEX.test(value.trim())
  );
};

// POST /api/hackathon/register
export const registerHackathon = async (req, res) => {
  try {
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
      demoVideoLink = "",
      teamSize,
      teamMembers = [],
    } = req.body;

    // 1. Validate authenticated user.
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before registering.",
      });
    }

    // 2. Validate required text fields.
    const requiredFields = {
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
      teamSize,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => {
        return (
          value === undefined ||
          value === null ||
          (typeof value === "string" && !value.trim())
        );
      })
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
        missingFields,
      });
    }

    // 3. Normalize and validate participant email.
    if (
      typeof email !== "string" ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const accountEmail = user.email.trim().toLowerCase();

    if (normalizedEmail !== accountEmail) {
      return res.status(400).json({
        success: false,
        message: "Registration email must match your account email.",
      });
    }

    // 4. Validate participant details.
    if (!isValidName(fullName)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid full name.",
      });
    }

    if (
      typeof mobileNumber !== "string" ||
      !/^[6-9]\d{9}$/.test(mobileNumber.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    if (
      typeof collegeName !== "string" ||
      collegeName.trim().length < 2 ||
      collegeName.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid college name.",
      });
    }

    if (
      typeof projectName !== "string" ||
      projectName.trim().length < 5 ||
      projectName.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Project name must contain 5 to 100 characters.",
      });
    }

    // 5. Validate team size.
    const parsedTeamSize = Number(teamSize);

    if (
      !Number.isInteger(parsedTeamSize) ||
      parsedTeamSize < 1 ||
      parsedTeamSize > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Team size must be a whole number between 1 and 5.",
      });
    }

    // 6. Validate additional team members.
    if (!Array.isArray(teamMembers)) {
      return res.status(400).json({
        success: false,
        message: "Team members must be provided as an array.",
      });
    }

    const expectedAdditionalMembers = parsedTeamSize - 1;

    if (teamMembers.length !== expectedAdditionalMembers) {
      return res.status(400).json({
        success: false,
        message: `For team size ${parsedTeamSize}, provide exactly ${expectedAdditionalMembers} additional team member(s).`,
      });
    }

    const normalizedMembers = [];

    for (let index = 0; index < teamMembers.length; index++) {
      const member = teamMembers[index];

      if (!member || typeof member !== "object" || Array.isArray(member)) {
        return res.status(400).json({
          success: false,
          message: `Invalid team member details at position ${index + 1}.`,
        });
      }

      const memberName =
        typeof member.fullName === "string" ? member.fullName.trim() : "";

      const memberEmail =
        typeof member.email === "string"
          ? member.email.trim().toLowerCase()
          : "";

      if (!isValidName(memberName, 3, 50)) {
        return res.status(400).json({
          success: false,
          message: `Please provide a valid name for team member ${index + 1}.`,
        });
      }

      if (!EMAIL_REGEX.test(memberEmail)) {
        return res.status(400).json({
          success: false,
          message: `Please provide a valid email for team member ${index + 1}.`,
        });
      }

      if (memberEmail === accountEmail) {
        return res.status(400).json({
          success: false,
          message: "The main participant must not be added again as a team member.",
        });
      }

      if (
        normalizedMembers.some((existing) => existing.email === memberEmail)
      ) {
        return res.status(400).json({
          success: false,
          message: `Duplicate team member email: ${memberEmail}.`,
        });
      }

      normalizedMembers.push({
        fullName: memberName,
        email: memberEmail,
      });
    }

    // 7. Validate project links.
    if (!isValidHttpUrl(pptLink)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS PPT link.",
      });
    }

    if (!isValidHttpUrl(prototypeLink)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS prototype link.",
      });
    }

    if (demoVideoLink && !isValidHttpUrl(demoVideoLink)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid HTTP or HTTPS demo video link.",
      });
    }

    // 8. Prevent duplicate registration.
    const existingEntry = await HackathonRegistration.findOne({
      user: req.userId,
    });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this hackathon.",
      });
    }

    // 9. Save registration in MongoDB.
    const registration = await HackathonRegistration.create({
      user: req.userId,
      fullName: fullName.trim(),
      email: accountEmail,
      mobileNumber: mobileNumber.trim(),
      collegeName: collegeName.trim(),
      course,
      branch,
      yearOfStudy,
      domain,
      projectName: projectName.trim(),
      pptLink: pptLink.trim(),
      prototypeLink: prototypeLink.trim(),
      demoVideoLink: demoVideoLink.trim(),
      teamSize: parsedTeamSize,
      teamMembers: normalizedMembers,
    });

    // 10. Send confirmation email after successful database save.
    let emailSent = false;

    try {
      await sendRegistrationConfirmationEmail(registration);
      emailSent = true;

      console.log(
        `[HACKATHON] Confirmation email sent to ${registration.email}`
      );
    } catch (emailError) {
      // Keep the registration even when email delivery fails.
      console.error("[HACKATHON] Confirmation email failed:", {
        code: emailError.code,
        message: emailError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Hackathon registration completed successfully. Confirmation email sent."
        : "Hackathon registration completed successfully, but confirmation email could not be sent.",
      emailSent,
      registration,
    });
  } catch (error) {
    console.error("[HACKATHON] Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this hackathon.",
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Registration validation failed.",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
    });
  }
};

// GET /api/hackathon/my-entry
export const getMyEntry = async (req, res) => {
  try {
    const registration = await HackathonRegistration.findOne({
      user: req.userId,
    }).populate("user", "fullName email");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "No hackathon registration found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration retrieved successfully.",
      registration,
    });
  } catch (error) {
    console.error("[HACKATHON] Get registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve registration.",
    });
  }
};

// DELETE /api/hackathon/:id
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format.",
      });
    }

    const registration = await HackathonRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // A user can delete only their own registration.
    if (registration.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this registration.",
      });
    }

    await HackathonRegistration.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Hackathon registration deleted successfully.",
    });
  } catch (error) {
    console.error("[HACKATHON] Delete registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete registration.",
    });
  }
};
