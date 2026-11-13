
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

const colleges = [
  "IIT Bhubaneswar",
  "NIT Rourkela",
  "KIIT University",
  "SOA University",
  "Odisha University of Technology and Research",
  "VSSUT Burla",
  "Government College of Engineering, Keonjhar",
  "Other",
];

const courses = ["B.Tech", "M.Tech", "BCA", "MCA", "BSc", "Other"];

const branches = ["CSE", "IT", "ECE", "ME", "CE", "Other"];

const years = ["1st", "2nd", "3rd", "4th"];

const domains = [
  "AI/ML",
  "Web Development",
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
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const SectionTitle = ({ number, title, description }) => (
  <div className="mb-6 flex items-start gap-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
      {number}
    </span>

    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

const FormField = ({ id, label, required = true, children }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
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
      return "Full name must contain 3–50 letters and spaces only.";
    }

    if (!isValidEmail(email)) {
      return "Your account email address is invalid. Please log in again.";
    }

    if (!isValidIndianMobile(mobileNumber)) {
      return "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }

    if (!colleges.includes(collegeName)) {
      return "Please select a valid college.";
    }

    if (!courses.includes(course)) {
      return "Please select a valid course.";
    }

    if (!branches.includes(branch)) {
      return "Please select a valid branch.";
    }

    if (!years.includes(yearOfStudy)) {
      return "Please select a valid year of study.";
    }

    if (!domains.includes(domain)) {
      return "Please select a valid project domain.";
    }

    if (projectName.trim().length < 5 || projectName.trim().length > 100) {
      return "Project name must contain between 5 and 100 characters.";
    }

    if (!isValidHttpUrl(pptLink)) {
      return "Enter a valid HTTP or HTTPS PPT link.";
    }

    if (!isValidHttpUrl(prototypeLink)) {
      return "Enter a valid HTTP or HTTPS prototype link.";
    }

    if (demoVideoLink.trim() && !isValidHttpUrl(demoVideoLink)) {
      return "Enter a valid HTTP or HTTPS demo video link.";
    }

    const size = Number(teamSize);

    if (!Number.isInteger(size) || size < 1 || size > 5) {
      return "Team size must be between 1 and 5.";
    }

    if (teamMembers.length !== size - 1) {
      return "The number of additional team members does not match your team size.";
    }

    for (let index = 0; index < teamMembers.length; index++) {
      const member = teamMembers[index];

      if (!isValidPersonName(member.fullName || "")) {
        return `Team member ${index + 1} must have a valid name (3–50 letters).`;
      }

      if (!isValidEmail(member.email || "")) {
        return `Enter a valid email address for team member ${index + 1}.`;
      }

      if (member.email.trim().toLowerCase() === email.trim().toLowerCase()) {
        return `Team member ${index + 1} cannot use the participant's email address.`;
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
          "Your hackathon registration was successful!"
      );

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your connection and try again."
      );

      submittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <header className="mb-8">
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Code-a-Nova 2026
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Hackathon Registration
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Complete the form below to register your project.
              Review your personal information, academic details,
              project links, and team information before submitting.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Participant Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionTitle
              number="1"
              title="Participant Information"
              description="Enter your personal and contact details."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="fullName" label="Full Name">
                <input
                  id="fullName"
                  className={inputClass}
                  value={formData.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="Enter your full name"
                  minLength={3}
                  maxLength={50}
                  autoComplete="name"
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField id="email" label="Email Address">
                <input
                  id="email"
                  className={inputClass}
                  type="email"
                  value={formData.email}
                  readOnly
                  autoComplete="email"
                  required
                />

                <p className="mt-1 text-xs text-slate-500">
                  Your registered account email cannot be changed here.
                </p>
              </FormField>

              <FormField id="mobileNumber" label="Mobile Number">
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
                  placeholder="10-digit mobile number"
                  autoComplete="tel-national"
                  required
                  disabled={loading}
                />
              </FormField>
            </div>
          </section>

          {/* Section 2: Academic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionTitle
              number="2"
              title="Academic Information"
              description="Provide your current college and study details."
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
                  <option value="">Select your college</option>

                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="course" label="Course">
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
                  <option value="">Select course</option>

                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="branch" label="Branch">
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
                  <option value="">Select branch</option>

                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
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
                  <option value="">Select year</option>

                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year} Year
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Section 3: Project Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionTitle
              number="3"
              title="Project Information"
              description="Tell us about your hackathon project."
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
                  <option value="">Select project domain</option>

                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="projectName" label="Project Name">
                <input
                  id="projectName"
                  className={inputClass}
                  value={formData.projectName}
                  onChange={(event) =>
                    updateField("projectName", event.target.value)
                  }
                  placeholder="Enter your project name"
                  minLength={5}
                  maxLength={100}
                  required
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter a project name between 5 and 100 characters.
                </p>
              </FormField>

              <FormField id="pptLink" label="PPT Link">
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
                <p className="mt-1 text-xs text-slate-500">
                  Provide a shareable Google Drive or OneDrive presentation link.
                </p>
              </FormField>

              <FormField id="prototypeLink" label="Prototype Link">
                <input
                  id="prototypeLink"
                  className={inputClass}
                  type="url"
                  value={formData.prototypeLink}
                  onChange={(event) =>
                    updateField("prototypeLink", event.target.value)
                  }
                  placeholder="GitHub, Figma, or live demo URL"
                  required
                  disabled={loading}
                />
              </FormField>

              <FormField
                id="demoVideoLink"
                label="Demo Video Link"
                required={false}
              >
                <input
                  id="demoVideoLink"
                  className={inputClass}
                  type="url"
                  value={formData.demoVideoLink}
                  onChange={(event) =>
                    updateField("demoVideoLink", event.target.value)
                  }
                  placeholder="YouTube or Google Drive URL (optional)"
                  disabled={loading}
                />
              </FormField>
            </div>
          </section>

          {/* Section 4: Team Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionTitle
              number="4"
              title="Team Information"
              description="Select your team size and add the details of your teammates."
            />

            <div className="max-w-xs">
              <FormField id="teamSize" label="Team Size">
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
                      {size} {size === 1 ? "Member" : "Members"}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="mt-6 space-y-5">
              {formData.teamMembers.length === 0 ? (
                <div className="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
                  You selected individual registration. No additional
                  team member details are required.
                </div>
              ) : (
                formData.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 p-4 sm:p-5"
                  >
                    <h3 className="mb-4 font-bold text-slate-800">
                      Team Member {index + 1}
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        id={`member-name-${index}`}
                        label="Member Full Name"
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
                          placeholder="Enter member name"
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
                          placeholder="Enter member email"
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

          {/* Error and Success Messages */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="rounded-lg bg-indigo-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting Registration..." : "Submit Registration"}
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Fields marked with * are mandatory. Please review your
            information before submitting.
          </p>
        </form>
      </div>
    </div>
  );
};

export default HackathonRegistration;
