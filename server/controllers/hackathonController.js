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

    // For team size > 1, expect either teamSize - 1 additional members or teamSize entries
    if (parsedTeamSize > 1 && members.length !== parsedTeamSize - 1 && members.length !== parsedTeamSize) {
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

    // Clean up members: if parsedTeamSize > 1 and members.length === parsedTeamSize and first matches user, slice
    let finalMembers = members;
    if (parsedTeamSize === 1) {
      finalMembers = [];
    } else if (members.length === parsedTeamSize && members[0]?.email?.toLowerCase() === user.email) {
      finalMembers = members.slice(1);
    }

    // Save registration in MongoDB first
    const registration = await HackathonRegistration.create({
      user: req.userId,
      fullName: fullName.trim(),
      email: user.email,
      mobileNumber: mobileNumber.trim(),
      collegeName: collegeName.trim(),
      course,
      branch,
      yearOfStudy,
      domain,
      projectName: projectName.trim(),
      pptLink: pptLink.trim(),
      prototypeLink: prototypeLink.trim(),
      demoVideoLink: (demoVideoLink || "").trim(),
      teamSize: parsedTeamSize,
      teamMembers: finalMembers,
    });

    // Send confirmation email after successful database save via Nodemailer
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
        ? "Hackathon registration completed successfully. Confirmation email sent via Nodemailer."
        : "Hackathon registration completed successfully.",
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

// DELETE /api/hackathon/:id (Admin / User deletion)
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format",
      });
    }

    // Check if entry exists and belongs to the user (or admin)
    const registration = await HackathonRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Ensure the requester owns this registration
    if (registration.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this registration",
      });
    }

    await HackathonRegistration.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Hackathon registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete Hackathon Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete registration",
    });
  }
};
