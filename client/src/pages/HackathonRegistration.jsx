import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { Sparkles, ArrowLeft, Users, FileText, GraduationCap, User } from "lucide-react";

const colleges = [
  "IIT Bhubaneswar",
  "NIT Rourkela",
  "KIIT University",
  "SOA University",
  "Odisha University of Technology and Research (OUTR)",
  "VSSUT Burla",
  "Government College of Engineering, Keonjhar",
  "IIT Delhi",
  "IIT Bombay",
  "BITS Pilani",
  "IIIT Hyderabad",
  "Other",
];

const courses = ["B.Tech", "M.Tech", "BCA", "MCA", "BSc", "Other"];

const branches = ["CSE", "IT", "ECE", "ME", "CE", "Other"];

const years = ["1st", "2nd", "3rd", "4th"];

const domains = [
  "AI/ML",
  "Web Dev",
  "IoT",
  "Cyber Security",
  "Blockchain",
  "Other",
];

const initialForm = {
  fullName: "",
  email: "",
  mobileNumber: "",
  collegeName: "",
  course: "",
  branch: "",
  yearOfStudy: "",
  domain: "",
  projectName: "",
  pptLink: "",
  prototypeLink: "",
  demoVideoLink: "",
  teamSize: "1",
  teamMembers: [],
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400";

const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300";

const SectionTitle = ({ icon: Icon, number, title, description }) => (
  <div className="mb-6 flex items-start gap-3 border-b border-slate-800 pb-4">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-sm font-bold text-indigo-400">
      {number}
    </span>

    <div>
      <h2 className="flex items-center gap-2 text-base font-bold text-white">
        {Icon && <Icon size={18} className="text-indigo-400" />}
        {title}
      </h2>
      <p className="mt-0.5 text-xs text-slate-400">{description}</p>
    </div>
  </div>
);

const FormField = ({ id, label, required = true, children }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
    {children}
  </div>
);

// Validate HTTP and HTTPS URLs only.
const isValidHttpUrl = (value) => {
  if (!value || typeof value !== "string") return false;

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

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPersonName = (name) =>
  /^[A-Za-z ]{3,50}$/.test(name.trim());

const isValidIndianMobile = (mobile) =>
  /^[6-9]\d{9}$/.test(mobile.trim());

const HackathonRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const submittingRef = useRef(false);

  const [formData, setFormData] = useState({
    ...initialForm,
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleTeamSizeChange = (value) => {
    const size = Number(value);

    if (!Number.isInteger(size) || size < 1 || size > 5) return;

    setFormData((previous) => {
      // Dynamic Team Members:
      // When Team Size = 1 -> Solo (no extra member boxes)
      // When Team Size > 1 -> Renders member boxes for teammates (size - 1 additional members)
      const requiredMembers = size - 1;
      const updatedMembers = [...previous.teamMembers];

      while (updatedMembers.length < requiredMembers) {
        updatedMembers.push({ fullName: "", email: "" });
      }

      return {
        ...previous,
        teamSize: value,
        teamMembers: updatedMembers.slice(0, requiredMembers),
      };
    });

    setError("");
  };

  const updateTeamMember = (index, field, value) => {
    setFormData((previous) => {
      const updatedMembers = [...previous.teamMembers];

      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };

      return {
        ...previous,
        teamMembers: updatedMembers,
      };
    });

    setError("");
  };

  const validateForm = () => {
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
    } = formData;

    if (!isValidPersonName(fullName)) {
      return "Full name must contain at least 3 letters (letters and spaces only).";
    }

    if (!isValidEmail(email)) {
      return "Your account email address is invalid. Please log in again.";
    }

    if (!isValidIndianMobile(mobileNumber)) {
      return "Enter a valid 10-digit Indian mobile number (e.g., 9876543210).";
    }

    if (!colleges.includes(collegeName)) {
      return "Please select a college from the list.";
    }

    if (!courses.includes(course)) {
      return "Please select a valid course.";
    }

    if (!branches.includes(branch)) {
      return "Please select a valid branch.";
    }

    if (!years.includes(yearOfStudy)) {
      return "Please select your year of study.";
    }

    if (!domains.includes(domain)) {
      return "Please select a project domain / track.";
    }

    if (projectName.trim().length < 5 || projectName.trim().length > 100) {
      return "Project name must contain at least 5 characters.";
    }

    if (!isValidHttpUrl(pptLink)) {
      return "Enter a valid PPT link (Google Drive / OneDrive shareable link).";
    }

    if (!isValidHttpUrl(prototypeLink)) {
      return "Enter a valid prototype link (GitHub / Figma / Live Demo).";
    }

    if (demoVideoLink.trim() && !isValidHttpUrl(demoVideoLink)) {
      return "Enter a valid demo video link (YouTube / Google Drive URL).";
    }

    const size = Number(teamSize);

    if (!Number.isInteger(size) || size < 1 || size > 5) {
      return "Team size must be between 1 and 5.";
    }

    if (size > 1 && teamMembers.length !== size - 1) {
      return "Please provide details for all additional team members.";
    }

    for (let index = 0; index < teamMembers.length; index++) {
      const member = teamMembers[index];

      if (!isValidPersonName(member.fullName || "")) {
        return `Team member ${index + 2} must have a valid name (minimum 3 letters).`;
      }

      if (!isValidEmail(member.email || "")) {
        return `Enter a valid email address for team member ${index + 2}.`;
      }

      if (member.email.trim().toLowerCase() === email.trim().toLowerCase()) {
        return `Team member ${index + 2} cannot have the same email as the team leader.`;
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobileNumber: formData.mobileNumber.trim(),
      collegeName: formData.collegeName,
      course: formData.course,
      branch: formData.branch,
      yearOfStudy: formData.yearOfStudy,
      domain: formData.domain,
      projectName: formData.projectName.trim(),
      pptLink: formData.pptLink.trim(),
      prototypeLink: formData.prototypeLink.trim(),
      demoVideoLink: formData.demoVideoLink.trim(),
      teamSize: Number(formData.teamSize),
      teamMembers: formData.teamMembers.map((member) => ({
        fullName: member.fullName.trim(),
        email: member.email.trim().toLowerCase(),
      })),
    };

    try {
      const response = await api.post(
        "/api/hackathon/register",
        payload
      );

      setSuccess(
        response.data?.message ||
          "Registration completed! Confirmation email sent via Nodemailer."
      );

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please verify your details and try again."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      submittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <div className="mt-4">
            <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300 uppercase tracking-widest">
              MatruCare AI Hackathon 2026
            </span>

            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Hackathon Event Registration
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-6 max-w-2xl">
              Fill out all required details below. Upon successful submission, your entry
              will be persisted in MongoDB and an automated confirmation email with full
              team details will be dispatched from <strong>matrucareai@gmail.com</strong>.
            </p>
          </div>
        </header>

        {/* Feedback Alerts */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs sm:text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-xs sm:text-sm text-green-300"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Participant Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl">
            <SectionTitle
              icon={User}
              number="1"
              title="Participant Information"
              description="Personal and contact details of the team lead / primary registrant."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="fullName" label="Full Name (Min 3 chars, letters only)">
                <input
                  id="fullName"
                  className={inputClass}
                  value={formData.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="Enter full name"
                  minLength={3}
                  maxLength={50}
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField id="email" label="Email Address (Pre-filled from auth)">
                <input
                  id="email"
                  className={inputClass}
                  type="email"
                  value={formData.email}
                  readOnly
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Locked to your verified MatruCare AI login account.
                </p>
              </FormField>

              <FormField id="mobileNumber" label="Mobile Number (10-digit Indian number)">
                <input
                  id="mobileNumber"
                  className={inputClass}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={(event) =>
                    updateField(
                      "mobileNumber",
                      event.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number (e.g. 9876543210)"
                  required
                  disabled={loading}
                />
              </FormField>
            </div>
          </section>

          {/* Section 2: Academic Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl">
            <SectionTitle
              icon={GraduationCap}
              number="2"
              title="Academic Background"
              description="College name, degree course, branch, and current year of study."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="collegeName" label="College Name">
                <select
                  id="collegeName"
                  className={inputClass}
                  value={formData.collegeName}
                  onChange={(event) =>
                    updateField("collegeName", event.target.value)
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select College</option>
                  {colleges.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="course" label="Course / Degree">
                <select
                  id="course"
                  className={inputClass}
                  value={formData.course}
                  onChange={(event) =>
                    updateField("course", event.target.value)
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="branch" label="Branch / Specialization">
                <select
                  id="branch"
                  className={inputClass}
                  value={formData.branch}
                  onChange={(event) =>
                    updateField("branch", event.target.value)
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="yearOfStudy" label="Year of Study">
                <select
                  id="yearOfStudy"
                  className={inputClass}
                  value={formData.yearOfStudy}
                  onChange={(event) =>
                    updateField("yearOfStudy", event.target.value)
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y} Year
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Section 3: Project Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl">
            <SectionTitle
              icon={FileText}
              number="3"
              title="Project Information"
              description="Domain track, project name, presentation slides, and code prototype links."
            />

            <div className="space-y-5">
              <FormField id="domain" label="Domain / Track">
                <select
                  id="domain"
                  className={inputClass}
                  value={formData.domain}
                  onChange={(event) =>
                    updateField("domain", event.target.value)
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Domain / Track</option>
                  {domains.map((dom) => (
                    <option key={dom} value={dom}>
                      {dom}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="projectName" label="Project Name (Min 5 chars)">
                <input
                  id="projectName"
                  className={inputClass}
                  value={formData.projectName}
                  onChange={(event) =>
                    updateField("projectName", event.target.value)
                  }
                  placeholder="Enter your hackathon project name"
                  minLength={5}
                  maxLength={100}
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField id="pptLink" label="PPT Link (Google Drive / OneDrive shareable link)">
                <input
                  id="pptLink"
                  className={inputClass}
                  type="url"
                  value={formData.pptLink}
                  onChange={(event) =>
                    updateField("pptLink", event.target.value)
                  }
                  placeholder="https://drive.google.com/..."
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField id="prototypeLink" label="Prototype Link (GitHub / Figma / Live Demo link)">
                <input
                  id="prototypeLink"
                  className={inputClass}
                  type="url"
                  value={formData.prototypeLink}
                  onChange={(event) =>
                    updateField("prototypeLink", event.target.value)
                  }
                  placeholder="https://github.com/username/project or Figma link"
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField id="demoVideoLink" label="Demo Video Link (Optional — YouTube / Drive link)" required={false}>
                <input
                  id="demoVideoLink"
                  className={inputClass}
                  type="url"
                  value={formData.demoVideoLink}
                  onChange={(event) =>
                    updateField("demoVideoLink", event.target.value)
                  }
                  placeholder="https://youtube.com/... or Google Drive URL (Optional)"
                  disabled={loading}
                />
              </FormField>
            </div>
          </section>

          {/* Section 4: Team Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl">
            <SectionTitle
              icon={Users}
              number="4"
              title="Team Size & Members"
              description="Select total team size (1-5). Dynamic entry fields will generate for additional team members."
            />

            <div className="max-w-xs">
              <FormField id="teamSize" label="Total Team Size (1–5)">
                <select
                  id="teamSize"
                  className={inputClass}
                  value={formData.teamSize}
                  onChange={(event) =>
                    handleTeamSizeChange(event.target.value)
                  }
                  required
                  disabled={loading}
                >
                  {[1, 2, 3, 4, 5].map((size) => (
                    <option key={size} value={size}>
                      {size} {size === 1 ? "Member (Solo)" : "Members"}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="mt-6 space-y-4">
              {formData.teamMembers.length === 0 ? (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-indigo-300">
                  Team Size = 1: Solo registration. No extra team member entry boxes required.
                </div>
              ) : (
                formData.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5"
                  >
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Team Member {index + 2} Details
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        id={`member-name-${index}`}
                        label="Member Name"
                      >
                        <input
                          id={`member-name-${index}`}
                          className={inputClass}
                          value={member.fullName}
                          onChange={(event) =>
                            updateTeamMember(
                              index,
                              "fullName",
                              event.target.value
                            )
                          }
                          placeholder="Teammate full name"
                          minLength={3}
                          maxLength={50}
                          required
                          disabled={loading}
                        />
                      </FormField>

                      <FormField
                        id={`member-email-${index}`}
                        label="Member Email"
                      >
                        <input
                          id={`member-email-${index}`}
                          className={inputClass}
                          type="email"
                          value={member.email}
                          onChange={(event) =>
                            updateTeamMember(
                              index,
                              "email",
                              event.target.value
                            )
                          }
                          placeholder="Teammate email address"
                          required
                          disabled={loading}
                        />
                      </FormField>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center text-xs font-semibold text-slate-300 transition hover:bg-slate-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-indigo-600/30"
            >
              {loading ? "Submitting Registration..." : "Submit Hackathon Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HackathonRegistration;
