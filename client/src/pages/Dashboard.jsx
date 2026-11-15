
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
  ShieldCheck,
  Activity,
  Phone,
} from "lucide-react";

// ---------------------------------------------
// REUSABLE COMPONENTS
// ---------------------------------------------

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-slate-700/80 bg-[#070d20]/80 p-5 transition hover:border-indigo-500/40">
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
  <div className="flex flex-col gap-1 border-b border-slate-800 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
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
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-[#070d20]/80 p-4 transition hover:border-indigo-500 hover:bg-slate-800/80"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon size={20} className="shrink-0 text-indigo-400" />

        <span className="truncate text-sm font-medium text-white">
          {label}
        </span>
      </div>

      <ExternalLink size={17} className="shrink-0 text-slate-400" />
    </a>
  );
};

// ---------------------------------------------
// DASHBOARD
// ---------------------------------------------

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [registration, setRegistration] = useState(null);
  const [loadingRegistration, setLoadingRegistration] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------------------
  // FETCH REGISTRATION
  // -------------------------------------------

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

      // Support the response structures used by the API.
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
        // No registration found.
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

  // -------------------------------------------
  // LOAD REGISTRATION AFTER AUTHENTICATION
  // -------------------------------------------

  useEffect(() => {
    if (!authLoading && user) {
      fetchRegistration();
    }
  }, [authLoading, user, fetchRegistration]);

  // -------------------------------------------
  // REFRESH
  // -------------------------------------------

  const handleRefresh = () => {
    fetchRegistration(true);
  };

  // -------------------------------------------
  // USER INFORMATION
  // -------------------------------------------

  const fullName = user?.fullName || "Participant";
  const email = user?.email || "Not available";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  // -------------------------------------------
  // REGISTRATION INFORMATION
  // -------------------------------------------

  const teamMembers = Array.isArray(registration?.teamMembers)
    ? registration.teamMembers
    : [];

  // Backend schema uses "year" and "mobile".
  const registrationYear = registration?.year;
  const registrationMobile = registration?.mobile;

  // -------------------------------------------
  // AUTHENTICATION LOADING
  // -------------------------------------------

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030617] text-white">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-indigo-400"
            size={36}
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------
  // MAIN UI
  // -------------------------------------------

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#030617] text-white">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[150px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[150px]" />

      {/* NAVBAR */}

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8">

        {/* DASHBOARD HEADER */}

        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <LayoutDashboard size={16} />
              MatruCare AI Participant Portal
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {fullName.split(" ")[0]}!
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              Manage your profile and track your MatruCare AI Hackathon
              registration status.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loadingRegistration}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-white transition hover:border-indigo-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </section>

        {/* MAIN GRID */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT COLUMN */}

          <div className="space-y-6 lg:col-span-2">

            {/* PROFILE CARD */}

            <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#111b3b] via-[#0f172a] to-[#11102c] p-6 shadow-xl shadow-indigo-950/20 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
                  {initials || "U"}
                </div>

                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <ShieldCheck size={13} />
                    Verified Participant
                  </span>

                  <h2 className="mt-2 break-words text-2xl font-bold">
                    {fullName}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 break-all text-sm text-slate-400">
                    <Mail size={15} className="shrink-0" />
                    {email}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-slate-700/60 pt-5">
                <p className="text-sm leading-7 text-slate-300">
                  Welcome to{" "}
                  <strong className="text-white">
                    MatruCare AI Hackathon 2026
                  </strong>
                  . Keep your project information updated, review your
                  submitted team details, and check your registration
                  status below.
                </p>
              </div>
            </section>

            {/* REGISTRATION STATUS */}

            <section className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl shadow-black/10 sm:p-7">

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    Hackathon Registration Status
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Your team and project submission details
                  </p>
                </div>

                {!loadingRegistration && !error && (
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                      registration
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-amber-500/20 bg-amber-500/10 text-amber-400"
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

              {/* LOADING */}

              {loadingRegistration && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <RefreshCw
                    size={30}
                    className="animate-spin text-indigo-400"
                  />

                  <p className="mt-4 text-sm text-slate-400">
                    Loading registration details...
                  </p>
                </div>
              )}

              {/* ERROR */}

              {!loadingRegistration && error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={21}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div>
                      <p className="text-sm font-semibold text-red-300">
                        Unable to load registration
                      </p>

                      <p className="mt-2 text-sm leading-6 text-red-200/80">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="mt-3 text-sm font-semibold text-red-300 underline disabled:opacity-50"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOT REGISTERED */}

              {!loadingRegistration && !error && !registration && (
                <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                    <Trophy size={30} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    You haven't registered yet!
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
                    Submit your academic background, project domain,
                    presentation link, prototype URL, and team details.
                    You can register individually or with a team of up to
                    five members.
                  </p>

                  <Link
                    to="/registration"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500"
                  >
                    Register Now
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}

              {/* REGISTERED */}

              {!loadingRegistration && !error && registration && (
                <div className="mt-6 space-y-7">

                  {/* CONFIRMATION */}

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                      <CheckCircle2 size={17} />
                      Registration confirmed
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-white">
                      {registration.projectName || "Your Project"}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your hackathon registration details are available
                      below. You have already submitted your registration.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
                      <ShieldCheck size={15} />
                      Registration Completed
                    </div>
                  </div>

                  {/* REGISTRATION DETAILS */}

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                      <FileText size={18} className="text-indigo-400" />
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
                        value={
                          registrationYear
                            ? `${registrationYear} Year`
                            : "Not provided"
                        }
                        icon={CalendarDays}
                      />
                    </div>
                  </div>

                  {/* PARTICIPANT INFORMATION */}

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                      <UserRound size={18} className="text-indigo-400" />
                      Participant Information
                    </h3>

                    <div className="rounded-xl border border-slate-700 bg-[#070d20]/80 px-5">
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
                        value={registrationMobile}
                      />

                      <DetailRow
                        label="Project Name"
                        value={registration.projectName}
                      />
                    </div>
                  </div>

                  {/* TEAM MEMBERS */}

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                      <Users size={18} className="text-indigo-400" />
                      Team Members
                    </h3>

                    {teamMembers.length > 0 ? (
                      <div className="space-y-3">

                        {/* TEAM LEADER */}

                        <div className="flex flex-col justify-between gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4 sm:flex-row sm:items-center">
                          <div>
                            <p className="text-sm font-bold text-indigo-300">
                              1. {registration.fullName} (Lead)
                            </p>

                            <p className="mt-1 break-all text-xs text-slate-400">
                              {registration.email}
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                            Team Leader
                          </span>
                        </div>

                        {/* OTHER MEMBERS */}

                        {teamMembers.map((member, index) => (
                          <div
                            key={`${member.email || "member"}-${index}`}
                            className="flex flex-col justify-between gap-3 rounded-xl border border-slate-700 bg-[#070d20]/80 p-4 sm:flex-row sm:items-center"
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {index + 2}. {member.fullName}
                              </p>

                              <p className="mt-1 break-all text-xs text-slate-400">
                                {member.email}
                              </p>
                            </div>

                            <span className="text-xs text-slate-400">
                              Member {index + 2}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-700 bg-[#070d20]/80 p-5">
                        <p className="text-sm leading-6 text-slate-400">
                          Individual registration (Solo participant) —
                          no additional team members.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* PROJECT RESOURCES */}

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                      <Code2 size={18} className="text-indigo-400" />
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

                  {/* REGISTRATION DATE */}

                  {registration.createdAt && (
                    <div className="flex items-center gap-2 border-t border-slate-800 pt-5 text-sm text-slate-400">
                      <CalendarDays size={16} className="text-indigo-400" />

                      Registered on:{" "}
                      <span className="font-medium text-white">
                        {new Date(
                          registration.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6">

            {/* NEXT STEPS */}

            <section className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Activity size={22} />
                </div>

                <h3 className="text-lg font-bold text-white">
                  Hackathon Next Steps
                </h3>
              </div>

              <ul className="mt-6 space-y-5 text-sm leading-6 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400">
                    1
                  </span>

                  <span>
                    Keep your presentation slides and prototype link
                    accessible so judges can review them.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400">
                    2
                  </span>

                  <span>
                    Check your email, including spam, for updates from
                    matrucareai@gmail.com.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400">
                    3
                  </span>

                  <span>
                    Keep checking the portal for hackathon announcements
                    and further updates.
                  </span>
                </li>
              </ul>
            </section>

            {/* ACCOUNT SECURITY */}

            <section className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck size={22} />
                </div>

                <h3 className="text-lg font-bold text-white">
                  Account Security
                </h3>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Your account is protected through email verification
                and secure authentication.
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm font-medium text-emerald-400">
                <CheckCircle2 size={17} />
                Email verified
              </div>
            </section>

            {/* HELP */}

            <section className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Mail size={22} />
                </div>

                <h3 className="text-lg font-bold text-white">
                  Need Help?
                </h3>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                For questions regarding your registration, contact
                the MatruCare AI team.
              </p>

              <a
                href="mailto:matrucareai@gmail.com"
                className="mt-4 inline-block break-all text-sm font-semibold text-indigo-400 transition hover:text-cyan-400"
              >
                matrucareai@gmail.com
              </a>
            </section>

          </div>
        </div>
      </main>

      {/* FOOTER */}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
