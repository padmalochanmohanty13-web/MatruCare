import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

import {
  UserRound,
  Mail,
  GraduationCap,
  CalendarDays,
  Users,
  Code2,
  FileText,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutDashboard,
  Trophy,
  Video,
} from "lucide-react";

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
    <div className="flex items-center gap-2 text-sm text-slate-400">
      {Icon && <Icon size={16} className="text-indigo-400" />}
      {label}
    </div>

    <p className="mt-2 break-words font-semibold text-white">
      {value || "Not provided"}
    </p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-b border-slate-800 py-3 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="break-words text-sm font-medium text-white sm:text-right">
      {value || "Not provided"}
    </span>
  </div>
);

const ExternalLinkCard = ({ label, url, icon: Icon }) => {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 transition hover:border-indigo-500 hover:bg-slate-800"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon size={20} className="shrink-0 text-indigo-400" />
        <span className="truncate text-sm font-medium text-white">{label}</span>
      </div>

      <ExternalLink size={17} className="shrink-0 text-slate-400" />
    </a>
  );
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [registration, setRegistration] = useState(null);
  const [loadingRegistration, setLoadingRegistration] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchRegistration = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoadingRegistration(true);
      }

      setError("");

      const response = await api.get("/api/hackathon/my-entry");
      const data = response.data;

      const entry =
        data?.registration ||
        data?.entry ||
        data?.data?.registration ||
        data?.data?.entry ||
        (data?.data?._id ? data.data : null) ||
        (data?._id ? data : null);

      setRegistration(entry || null);
    } catch (err) {
      if (err.response?.status === 404) {
        // A 404 means the logged-in user has not registered yet.
        setRegistration(null);
        setError("");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load your registration details. Please try again."
        );
      }
    } finally {
      setLoadingRegistration(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchRegistration();
    }
  }, [authLoading, user, fetchRegistration]);

  const handleRefresh = () => {
    fetchRegistration(true);
  };

  const fullName = user?.fullName || "Participant";
  const email = user?.email || "Not available";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const teamMembers = Array.isArray(registration?.teamMembers)
    ? registration.teamMembers
    : [];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-indigo-400"
            size={32}
          />
          <p className="mt-4 text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8">
        {/* Dashboard Heading */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <LayoutDashboard size={16} />
              MatruCare AI Participant Portal
            </div>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Welcome, {fullName.split(" ")[0]}!
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage your profile and track your MatruCare AI Hackathon registration status.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loadingRegistration}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-indigo-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Card */}
            <section className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
                  {initials || "U"}
                </div>

                <div className="min-w-0">
                  <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                    Verified Participant
                  </span>

                  <h2 className="mt-1.5 break-words text-2xl font-bold">
                    {fullName}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 break-all text-xs text-slate-400">
                    <Mail size={14} className="shrink-0" />
                    {email}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-700/60 pt-4">
                <p className="text-xs leading-6 text-slate-300">
                  Welcome to <strong>MatruCare AI Hackathon 2026</strong>. Keep your project
                  information updated, review your submitted team details, and check your status below.
                </p>
              </div>
            </section>

            {/* Registration Section */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">Hackathon Registration Status</h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Your team and project submission details
                  </p>
                </div>

                {!loadingRegistration && (
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${
                      registration
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {registration ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {registration ? "Registered" : "Not Registered"}
                  </span>
                )}
              </div>

              {/* Loading */}
              {loadingRegistration && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <RefreshCw
                    size={28}
                    className="animate-spin text-indigo-400"
                  />
                  <p className="mt-4 text-xs text-slate-400">
                    Loading registration details...
                  </p>
                </div>
              )}

              {/* Error */}
              {!loadingRegistration && error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div>
                      <p className="font-semibold text-red-300 text-sm">
                        Unable to load registration
                      </p>

                      <p className="mt-1 text-xs text-red-200/80">{error}</p>

                      <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-3 text-xs font-semibold text-red-300 underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Not Registered */}
              {!loadingRegistration && !error && !registration && (
                <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <Trophy size={28} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    You haven't registered for the hackathon yet!
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400">
                    Submit your academic background, domain track, presentation slide link,
                    prototype URL, and assemble your team (1-5 members).
                  </p>

                  <Link
                    to="/registration"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                  >
                    Register Now
                    <ArrowRight size={17} />
                  </Link>
                </div>
              )}

              {/* Registered */}
              {!loadingRegistration && !error && registration && (
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 size={16} />
                      Registration confirmed &amp; verified in MongoDB
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {registration.projectName || "Your Project"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Confirmation email was dispatched to <strong>{registration.email}</strong> via Nodemailer.
                    </p>
                  </div>

                  {/* Registration Details */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                      <FileText size={17} className="text-indigo-400" />
                      Registration Details
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        label="Domain / Track"
                        value={registration.domain}
                        icon={Code2}
                      />

                      <InfoCard
                        label="Team Size"
                        value={
                          registration.teamSize
                            ? `${registration.teamSize} Member(s)`
                            : "Not provided"
                        }
                        icon={Users}
                      />

                      <InfoCard
                        label="College Name"
                        value={registration.collegeName}
                        icon={GraduationCap}
                      />

                      <InfoCard
                        label="Course"
                        value={registration.course}
                        icon={GraduationCap}
                      />

                      <InfoCard
                        label="Branch"
                        value={registration.branch}
                        icon={Code2}
                      />

                      <InfoCard
                        label="Year of Study"
                        value={registration.yearOfStudy ? `${registration.yearOfStudy} Year` : "Not provided"}
                        icon={CalendarDays}
                      />
                    </div>
                  </div>

                  {/* Participant Information */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                      <UserRound size={17} className="text-indigo-400" />
                      Participant Information
                    </h3>

                    <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-5">
                      <DetailRow
                        label="Full Name"
                        value={registration.fullName}
                      />

                      <DetailRow
                        label="Email Address"
                        value={registration.email}
                      />

                      <DetailRow
                        label="Mobile Number"
                        value={registration.mobileNumber}
                      />

                      <DetailRow
                        label="Project Name"
                        value={registration.projectName}
                      />
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                      <Users size={17} className="text-indigo-400" />
                      Team Members
                    </h3>

                    {teamMembers.length > 0 ? (
                      <div className="space-y-2.5">
                        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-indigo-300">1. {registration.fullName} (Lead)</span>
                            <p className="text-xs text-slate-400">{registration.email}</p>
                          </div>
                          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">Team Leader</span>
                        </div>

                        {teamMembers.map((member, index) => (
                          <div
                            key={`${member.email || "member"}-${index}`}
                            className="rounded-xl border border-slate-700 bg-slate-950/60 p-3.5 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-semibold text-white text-xs">
                                {index + 2}. {member.fullName}
                              </p>
                              <p className="break-all text-xs text-slate-400">
                                {member.email}
                              </p>
                            </div>
                            <span className="text-[11px] text-slate-400">Member {index + 2}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                        <p className="text-xs text-slate-400">
                          Individual registration (Solo participant) — no additional team members.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Links */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                      <Code2 size={17} className="text-indigo-400" />
                      Project Resources
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <ExternalLinkCard
                        label="Presentation (PPT)"
                        url={registration.pptLink}
                        icon={FileText}
                      />

                      <ExternalLinkCard
                        label="Project Prototype"
                        url={registration.prototypeLink}
                        icon={Code2}
                      />

                      <ExternalLinkCard
                        label="Demo Video"
                        url={registration.demoVideoLink}
                        icon={Video}
                      />
                    </div>
                  </div>

                  {/* Submission Date */}
                  {registration.createdAt && (
                    <div className="border-t border-slate-800 pt-3 text-xs text-slate-400">
                      Registered on:{" "}
                      {new Date(registration.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Right Column / Quick Guidelines */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-base font-bold text-white">
                Hackathon Next Steps
              </h3>

              <ul className="mt-4 space-y-3 text-xs text-slate-300">
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-400">1.</span>
                  <span>Keep your presentation slides and prototype link public so judges can access them.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-400">2.</span>
                  <span>Check your email (including spam) for updates sent from <strong>matrucareai@gmail.com</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-400">3.</span>
                  <span>Mentorship notifications and final round shortlist will be announced on the portal.</span>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-base font-bold text-white">
                Need Help?
              </h3>

              <p className="mt-2 text-xs text-slate-400 leading-5">
                For questions regarding your registration, write to our team directly:
              </p>

              <a
                href="mailto:matrucareai@gmail.com"
                className="mt-3 inline-block font-mono text-xs font-semibold text-indigo-400 hover:underline"
              >
                matrucareai@gmail.com
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
