
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Link2,
  LoaderCircle,
  Sparkles,
  User,
  Users,
  AlertCircle,
  Code2,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

// ---------------------------------------------
// FORM OPTIONS
// ---------------------------------------------

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

// ---------------------------------------------
// INITIAL FORM DATA
// ---------------------------------------------

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

// ---------------------------------------------
// REUSABLE STYLES
// ---------------------------------------------

const inputClass =
  "w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300";

const sectionClass =
  "rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 shadow-xl shadow-black/10 sm:p-7";

// ---------------------------------------------
// REUSABLE COMPONENTS
// ---------------------------------------------

const SectionTitle = ({
  icon: Icon,
  number,
  title,
  description,
}) => (
  <div className="mb-6 flex items-start gap-3 border-b border-slate-800 pb-5">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-bold text-indigo-400">
      {number}
    </span>

    <div>
      <h2 className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
        {Icon && <Icon size={19} className="text-indigo-400" />}
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  </div>
);

const FormField = ({
  id,
  label,
  required = true,
  children,
}) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}

      {required && (
        <span className="ml-1 text-red-400">*</span>
      )}
    </label>

    {children}
  </div>
);

const InfoBanner = ({ children }) => (
  <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs leading-5 text-indigo-200">
    <Sparkles
      size={16}
      className="mt-0.5 shrink-0 text-indigo-400"
    />
    <p>{children}</p>
  </div>
);

// ---------------------------------------------
// VALIDATION HELPERS
// ---------------------------------------------

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPersonName = (name) => {
  const value = name.trim();

  return (
    value.length >= 3 &&
    value.length <= 80 &&
    /^[\p{L}][\p{L}\s'-]*$/u.test(value)
  );
};

const isValidIndianMobile = (mobile) =>
  /^[6-9]\d{9}$/.test(mobile.trim());

const isValidHttpUrl = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

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

// ---------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------

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

  // -------------------------------------------
  // UPDATE NORMAL FORM FIELDS
  // -------------------------------------------

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  // -------------------------------------------
  // CHANGE TEAM SIZE
  // -------------------------------------------

  const handleTeamSizeChange = (value) => {
    const size = Number(value);

    if (!Number.isInteger(size) || size < 1 || size > 5) {
      return;
    }

    setFormData((previous) => {
      const requiredMembers = size - 1;

      const updatedMembers = [...previous.teamMembers];

      while (updatedMembers.length < requiredMembers) {
        updatedMembers.push({
          fullName: "",
          email: "",
        });
      }

      return {
        ...previous,
        teamSize: value,
        teamMembers: updatedMembers.slice(
          0,
          requiredMembers
        ),
      };
    });

    setError("");
  };

  // -------------------------------------------
  // UPDATE TEAM MEMBER
  // -------------------------------------------

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

  // -------------------------------------------
  // VALIDATE FORM
  // -------------------------------------------

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
      return "Enter a valid full name containing at least 3 characters.";
    }

    if (!isValidEmail(email)) {
      return "Your account email is invalid. Please log in again.";
    }

    if (!isValidIndianMobile(mobileNumber)) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (!colleges.includes(collegeName)) {
      return "Please select a college.";
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
      return "Please select a project domain.";
    }

    if (
      projectName.trim().length < 5 ||
      projectName.trim().length > 100
    ) {
      return "Project name must contain between 5 and 100 characters.";
    }

    if (!isValidHttpUrl(pptLink)) {
      return "Enter a valid PPT link using HTTP or HTTPS.";
    }

    if (!isValidHttpUrl(prototypeLink)) {
      return "Enter a valid prototype link using HTTP or HTTPS.";
    }

    if (
      demoVideoLink.trim() &&
      !isValidHttpUrl(demoVideoLink)
    ) {
      return "Enter a valid demo video URL.";
    }

    const size = Number(teamSize);

    if (!Number.isInteger(size) || size < 1 || size > 5) {
      return "Team size must be between 1 and 5.";
    }

    if (teamMembers.length !== size - 1) {
      return "Please provide details for all team members.";
    }

    const teamEmails = new Set([
      email.trim().toLowerCase(),
    ]);

    for (let index = 0; index < teamMembers.length; index++) {
      const member = teamMembers[index];

      if (!isValidPersonName(member.fullName || "")) {
        return `Enter a valid name for team member ${index + 2}.`;
      }

      if (!isValidEmail(member.email || "")) {
        return `Enter a valid email for team member ${index + 2}.`;
      }

      const normalizedEmail = member.email
        .trim()
        .toLowerCase();

      if (teamEmails.has(normalizedEmail)) {
        return `Team member ${index + 2} has an email already used by another team member or the team leader.`;
      }

      teamEmails.add(normalizedEmail);
    }

    return "";
  };

  // -------------------------------------------
  // SUBMIT REGISTRATION
  // -------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    submittingRef.current = true;
    setLoading(true);

    // IMPORTANT:
    // These field names match the backend model.
    const payload = {
      fullName: formData.fullName.trim(),

      email: formData.email.trim().toLowerCase(),

      mobile: formData.mobileNumber.trim(),

      collegeName: formData.collegeName,

      course: formData.course,

      branch: formData.branch,

      year: formData.yearOfStudy,

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

      const responseMessage =
        response.data?.message ||
        "Your hackathon registration was submitted successfully.";

      setSuccess(responseMessage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Prevent another submission after success.
      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 1800);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);

      submittingRef.current = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // UI
  // -------------------------------------------

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030617] px-4 py-8 text-white sm:px-6 lg:px-8">

      {/* Background decoration */}

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-96 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">

        {/* HEADER */}

        <header className="mb-8">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <div className="mt-6">

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 sm:text-xs">
              <Sparkles size={14} />
              MatruCare AI Hackathon 2026
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Hackathon Event{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Registration
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Complete your registration with accurate participant,
              academic, project, and team information. Your
              submitted details will be securely stored in our
              database.
            </p>

          </div>

          {/* Progress information */}

          <div className="mt-7 flex flex-wrap items-center gap-3">

            {[
              "Participant",
              "Academic",
              "Project",
              "Team",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-300">
                  {index + 1}
                </span>

                <span className="text-[11px] font-medium text-slate-300">
                  {item}
                </span>
              </div>
            ))}

          </div>

        </header>

        {/* ERROR MESSAGE */}

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        {/* SUCCESS MESSAGE */}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Registration successful!
              </p>

              <p className="mt-1 text-xs leading-5 text-green-300/80">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* REGISTRATION FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* SECTION 1: PARTICIPANT */}

          <section className={sectionClass}>

            <SectionTitle
              icon={User}
              number="01"
              title="Participant Information"
              description="Personal and contact details of the primary registrant."
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <FormField
                id="fullName"
                label="Full Name"
              >
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="fullName"
                    type="text"
                    className={`${inputClass} pl-11`}
                    value={formData.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Enter your full name"
                    minLength={3}
                    maxLength={80}
                    autoComplete="name"
                    required
                    disabled={loading}
                  />
                </div>
              </FormField>

              <FormField
                id="email"
                label="Registered Email Address"
              >
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    className={`${inputClass} cursor-not-allowed pl-11 opacity-80`}
                    value={formData.email}
                    readOnly
                    required
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  This email is linked to your verified account.
                </p>
              </FormField>

              <FormField
                id="mobileNumber"
                label="Mobile Number"
              >
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    className={`${inputClass} pl-11`}
                    value={formData.mobileNumber}
                    onChange={(event) =>
                      updateField(
                        "mobileNumber",
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    autoComplete="tel"
                    required
                    disabled={loading}
                  />
                </div>
              </FormField>

            </div>

          </section>

          {/* SECTION 2: ACADEMIC */}

          <section className={sectionClass}>

            <SectionTitle
              icon={GraduationCap}
              number="02"
              title="Academic Background"
              description="Provide your college, degree, branch, and current year of study."
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <FormField
                id="collegeName"
                label="College / University"
              >
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <select
                    id="collegeName"
                    className={`${inputClass} pl-11`}
                    value={formData.collegeName}
                    onChange={(event) =>
                      updateField("collegeName", event.target.value)
                    }
                    required
                    disabled={loading}
                  >
                    <option value="">Select College</option>

                    {colleges.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </div>
              </FormField>

              <FormField
                id="course"
                label="Course / Degree"
              >
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

                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                id="branch"
                label="Branch / Specialization"
              >
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

                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                id="yearOfStudy"
                label="Year of Study"
              >
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

                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year} Year
                    </option>
                  ))}
                </select>
              </FormField>

            </div>

          </section>

          {/* SECTION 3: PROJECT */}

          <section className={sectionClass}>

            <SectionTitle
              icon={Code2}
              number="03"
              title="Project Information"
              description="Tell us about your hackathon project and share its presentation and prototype."
            />

            <div className="space-y-5">

              <FormField
                id="domain"
                label="Project Domain / Track"
              >
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
                  <option value="">Select Project Domain</option>

                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                id="projectName"
                label="Project Name"
              >
                <input
                  id="projectName"
                  type="text"
                  className={inputClass}
                  value={formData.projectName}
                  onChange={(event) =>
                    updateField("projectName", event.target.value)
                  }
                  placeholder="Enter your project title"
                  minLength={5}
                  maxLength={100}
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField
                id="pptLink"
                label="Presentation / PPT Link"
              >
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="pptLink"
                    type="url"
                    className={`${inputClass} pl-11`}
                    value={formData.pptLink}
                    onChange={(event) =>
                      updateField("pptLink", event.target.value)
                    }
                    placeholder="https://drive.google.com/..."
                    required
                    disabled={loading}
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Make sure your Google Drive or OneDrive link
                  has the required sharing permissions.
                </p>
              </FormField>

              <FormField
                id="prototypeLink"
                label="Prototype / Source Code Link"
              >
                <div className="relative">
                  <Link2
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="prototypeLink"
                    type="url"
                    className={`${inputClass} pl-11`}
                    value={formData.prototypeLink}
                    onChange={(event) =>
                      updateField("prototypeLink", event.target.value)
                    }
                    placeholder="https://github.com/username/project"
                    required
                    disabled={loading}
                  />
                </div>
              </FormField>

              <FormField
                id="demoVideoLink"
                label="Demo Video Link"
                required={false}
              >
                <input
                  id="demoVideoLink"
                  type="url"
                  className={inputClass}
                  value={formData.demoVideoLink}
                  onChange={(event) =>
                    updateField("demoVideoLink", event.target.value)
                  }
                  placeholder="https://youtube.com/... (Optional)"
                  disabled={loading}
                />
              </FormField>

            </div>

          </section>

          {/* SECTION 4: TEAM */}

          <section className={sectionClass}>

            <SectionTitle
              icon={Users}
              number="04"
              title="Team Information"
              description="Register individually or add up to four additional team members."
            />

            <div className="max-w-sm">

              <FormField
                id="teamSize"
                label="Total Team Size"
              >
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
                      {size}{" "}
                      {size === 1
                        ? "Member (Solo)"
                        : "Members"}
                    </option>
                  ))}
                </select>
              </FormField>

            </div>

            <div className="mt-6 space-y-4">

              {formData.teamMembers.length === 0 ? (
                <InfoBanner>
                  You selected solo registration. No additional
                  team member information is required.
                </InfoBanner>
              ) : (
                formData.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-5"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Users size={17} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Team Member {index + 2}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Enter your teammate's details.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      <FormField
                        id={`member-name-${index}`}
                        label="Member Full Name"
                      >
                        <input
                          id={`member-name-${index}`}
                          type="text"
                          className={inputClass}
                          value={member.fullName}
                          onChange={(event) =>
                            updateTeamMember(
                              index,
                              "fullName",
                              event.target.value
                            )
                          }
                          placeholder="Enter member name"
                          minLength={3}
                          maxLength={80}
                          required
                          disabled={loading}
                        />
                      </FormField>

                      <FormField
                        id={`member-email-${index}`}
                        label="Member Email Address"
                      >
                        <input
                          id={`member-email-${index}`}
                          type="email"
                          className={inputClass}
                          value={member.email}
                          onChange={(event) =>
                            updateTeamMember(
                              index,
                              "email",
                              event.target.value
                            )
                          }
                          placeholder="member@example.com"
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

          {/* FINAL INFORMATION */}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">

            <div className="flex items-start gap-3">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-indigo-400"
              />

              <div>
                <h3 className="text-xs font-bold text-slate-200">
                  Before submitting
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Verify all participant details, team member
                  emails, and project links. Ensure that shared
                  links can be accessed by the hackathon organizers.
                  Duplicate registrations are not permitted.
                </p>
              </div>
            </div>

          </div>

          {/* FORM BUTTONS */}

          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">

            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-700 px-6 py-3.5 text-center text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Submitting Registration...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={17} />
                  Registration Submitted
                </>
              ) : (
                <>
                  Submit Registration
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </div>

        </form>

        {/* FOOTER NOTE */}

        <div className="pb-5 text-center text-[11px] text-slate-500">
          © 2026 MatruCare AI. All rights reserved.
        </div>

      </div>

    </div>
  );
};

export default HackathonRegistration;
