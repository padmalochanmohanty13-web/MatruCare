
import mongoose from "mongoose";

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

const teamMemberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Team member name is required"],
      trim: true,
      minlength: [3, "Team member name must contain at least 3 characters"],
      maxlength: [50, "Team member name cannot exceed 50 characters"],
      match: [NAME_REGEX, "Enter a valid team member name"],
    },

    email: {
      type: String,
      required: [true, "Team member email is required"],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email address is too long"],
      match: [EMAIL_REGEX, "Enter a valid team member email address"],
    },
  },
  { _id: false }
);

const hackathonRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must contain at least 3 characters"],
      maxlength: [80, "Full name cannot exceed 80 characters"],
      match: [NAME_REGEX, "Enter a valid full name"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email address is too long"],
      match: [EMAIL_REGEX, "Enter a valid email address"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
    },

    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      minlength: [2, "College name must contain at least 2 characters"],
      maxlength: [150, "College name cannot exceed 150 characters"],
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      enum: ["B.Tech", "M.Tech", "BCA", "MCA", "BSc", "Other"],
    },

    branch: {
      type: String,
      required: [true, "Branch is required"],
      enum: ["CSE", "IT", "ECE", "ME", "CE", "Other"],
    },

    yearOfStudy: {
      type: String,
      required: [true, "Year of study is required"],
      enum: ["1st", "2nd", "3rd", "4th"],
    },

    domain: {
      type: String,
      required: [true, "Project domain is required"],
      enum: [
        "AI/ML",
        "Web Dev",
        "Web Development",
        "IoT",
        "Cyber Security",
        "Blockchain",
        "Other",
      ],
    },

    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [5, "Project name must contain at least 5 characters"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },

    pptLink: {
      type: String,
      required: [true, "PPT link is required"],
      trim: true,
      validate: {
        validator: isValidHttpUrl,
        message: "Enter a valid HTTP or HTTPS PPT link",
      },
    },

    prototypeLink: {
      type: String,
      required: [true, "Prototype link is required"],
      trim: true,
      validate: {
        validator: isValidHttpUrl,
        message: "Enter a valid HTTP or HTTPS prototype link",
      },
    },

    demoVideoLink: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: (value) => !value || isValidHttpUrl(value),
        message: "Enter a valid HTTP or HTTPS demo video link",
      },
    },

    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: [1, "Team size must be at least 1"],
      max: [5, "Team size cannot exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Team size must be a whole number",
      },
    },

    teamMembers: {
      type: [teamMemberSchema],
      default: [],
      validate: {
        validator: function (members) {
          if (!Number.isInteger(this.teamSize)) return false;
          return members.length === Math.max(0, this.teamSize - 1);
        },
        message:
          "The number of additional team members must equal team size minus one",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Normalize email addresses before saving.
hackathonRegistrationSchema.pre("validate", function () {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  if (Array.isArray(this.teamMembers)) {
    this.teamMembers.forEach((member) => {
      if (member.email) {
        member.email = member.email.trim().toLowerCase();
      }
    });
  }
});

const HackathonRegistration = mongoose.model(
  "HackathonRegistration",
  hackathonRegistrationSchema
);

export default HackathonRegistration;
