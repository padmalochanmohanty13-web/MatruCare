
import mongoose from "mongoose";
import HackathonRegistration from "../models/HackathonRegistration.js";
import User from "../models/User.js";
import {
  sendRegistrationConfirmationEmail,
} from "../services/emailService.js";

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
      demoVideoLink,
      teamSize,
      teamMembers,
    } = req.body;

    // Check authenticated user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before registering",
      });
    }

    // Validate required fields
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
      .filter(
        ([, value]) =>
          value === undefined ||
          value === null ||
          String(value).trim() === ""
      )
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
        missingFields,
      });
    }

    // Registration email must match authenticated account
    if (email.trim().toLowerCase() !== user.email) {
      return res.status(400).json({
        success: false,
        message: "Registration email must match your account email",
      });
    }

    // Validate team size
    const parsedTeamSize = Number(teamSize);

    if (
      !Number.isInteger(parsedTeamSize) ||
      parsedTeamSize < 1 ||
      parsedTeamSize > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Team size must be between 1 and 5",
      });
    }

    const members = teamMembers || [];

    if (!Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Team members must be provided as an array",
      });
    }

    if (members.length !== parsedTeamSize - 1) {
      return res.status(400).json({
        success: false,
        message: `For team size ${parsedTeamSize}, provide exactly ${
          parsedTeamSize - 1
        } additional team member(s)`,
      });
    }

    // Check existing registration
    const existingEntry = await HackathonRegistration.findOne({
      user: req.userId,
    });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this hackathon",
      });
    }

    // Validate links
    const isValidUrl = (value) => {
      try {
        const url = new URL(value);
        return (
          (url.protocol === "http:" || url.protocol === "https:") &&
          Boolean(url.hostname)
        );
      } catch {
        return false;
      }
    };

    if (!isValidUrl(pptLink) || !isValidUrl(prototypeLink)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid PPT and prototype URLs",
      });
    }

    if (demoVideoLink && !isValidUrl(demoVideoLink)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid demo video URL",
      });
    }

    // Save registration in MongoDB first
    const registration = await HackathonRegistration.create({
      user: req.userId,
      fullName: fullName.trim(),
      email: user.email,
      mobileNumber,
      collegeName,
      course,
      branch,
      yearOfStudy,
      domain,
      projectName: projectName.trim(),
      pptLink,
      prototypeLink,
      demoVideoLink: demoVideoLink || "",
      teamSize: parsedTeamSize,
      teamMembers: members,
    });

    // Send confirmation email after successful database save
    let emailSent = false;

    try {
      await sendRegistrationConfirmationEmail(registration);
      emailSent = true;

      console.log(
        `Registration confirmation email sent to ${registration.email}`
      );
    } catch (emailError) {
      // Do not delete the saved registration if email delivery fails.
      console.error(
        "Registration Confirmation Email Error:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Hackathon registration completed successfully. Confirmation email sent."
        : "Hackathon registration completed successfully, but the confirmation email could not be sent.",
      emailSent,
      registration,
    });
  } catch (error) {
    console.error("Hackathon Registration Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this hackathon",
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Registration validation failed",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during registration",
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
        message: "No hackathon registration found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration retrieved successfully",
      registration,
    });
  } catch (error) {
    console.error("Get Hackathon Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve registration",
    });
  }
};
