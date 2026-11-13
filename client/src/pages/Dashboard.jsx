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
  Phone,
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
            "Unable to load your registration details. Please try again.",
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
          <p className="mt-4 text-slate-400">Checking your account...</p>
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
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-indigo-400">
              <LayoutDashboard size={17} />
              Code-a-Nova Participant Portal
            </div>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Welcome, {fullName.split(" ")[0]}!
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your profile and hackathon registration from here.
            </p>
          </div>

          {/* Only Refresh button here. Logout is in Navbar. */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loadingRegistration}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-indigo-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Card */}
            <section className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
                  {initials || "U"}
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-indigo-300">
                    Your participant account
                  </p>

                  <h2 className="mt-1 break-words text-2xl font-bold">
                    {fullName}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 break-all text-sm text-slate-400">
                    <Mail size={16} className="shrink-0" />
                    {email}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-slate-700 pt-5">
                <p className="leading-7 text-slate-300">
                  Welcome to Code-a-Nova! Track your hackathon registration and
                  keep your project information organized in one place.
                </p>
              </div>
            </section>

            {/* Registration Section */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold">Hackathon Registration</h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Your current participation status
                  </p>
                </div>

                {!loadingRegistration && (
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                      registration
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {registration ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <Clock size={15} />
                    )}

                    {registration ? "Registered" : "Not Registered"}
                  </span>
                )}
              </div>

              {/* Loading */}
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

              {/* Error */}
              {!loadingRegistration && error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={21}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div>
                      <p className="font-semibold text-red-300">
                        Unable to load registration
                      </p>

                      <p className="mt-1 text-sm text-red-200/80">{error}</p>

                      <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-4 text-sm font-semibold text-red-300 underline"
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
                    Your Hackathon Journey Starts Here!
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    You have not submitted your hackathon registration yet.
                    Complete the registration form to participate.
                  </p>

                  <Link
                    to="/hackathon-registration"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Register Now
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}

              {/* Registered */}
              {!loadingRegistration && !error && registration && (
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                      <CheckCircle2 size={18} />
                      Registration submitted successfully
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-white">
                      {registration.projectName || "Your Project"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      Your hackathon registration details are available below.
                    </p>
                  </div>

                  {/* Registration Information */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                      <FileText size={19} className="text-indigo-400" />
                      Registration Details
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
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
                        label="College"
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
                        value={registration.yearOfStudy}
                        icon={CalendarDays}
                      />
                    </div>
                  </div>

                  {/* Participant Information */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <UserRound size={19} className="text-indigo-400" />
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
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <Users size={19} className="text-indigo-400" />
                      Team Members
                    </h3>

                    {teamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {teamMembers.map((member, index) => (
                          <div
                            key={`${member.email || "member"}-${index}`}
                            className="rounded-xl border border-slate-700 bg-slate-950/60 p-4"
                          >
                            <p className="font-semibold text-white">
                              {index + 2}. {member.fullName}
                            </p>

                            <p className="mt-1 break-all text-sm text-slate-400">
                              {member.email}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                        <p className="text-sm text-slate-400">
                          Individual participation — no additional team members.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Links */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <Code2 size={19} className="text-indigo-400" />
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
                    <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
                      Submitted on:{" "}
                      {new Date(registration.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Account Overview */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-bold">Account Overview</h2>

              <div className="mt-5 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">Account</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">Email</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">Registration</span>
                  <span className="text-sm font-semibold text-white">
                    {loadingRegistration
                      ? "Loading..."
                      : error
                        ? "Unavailable"
                        : registration
                          ? "Submitted"
                          : "Pending"}
                  </span>
                </div>
              </div>
            </section>

            {/* Help Card */}
            <section className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-6">
              <h2 className="text-lg font-bold">Need Help?</h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Have questions about the registration process? Reach out through
                our contact page.
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Contact Us
                <ArrowRight size={16} />
              </Link>
            </section>

            {/* Quick Navigation */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-bold">Quick Navigation</h2>

              <div className="mt-5 flex flex-col gap-4 text-sm">
                <Link
                  to="/"
                  className="text-slate-300 transition hover:text-indigo-400"
                >
                  ← Home
                </Link>

                <Link
                  to="/about"
                  className="text-slate-300 transition hover:text-indigo-400"
                >
                  About Code-a-Nova
                </Link>

                <Link
                  to="/contact"
                  className="text-slate-300 transition hover:text-indigo-400"
                >
                  Contact
                </Link>

                {!registration && (
                  <Link
                    to="/hackathon-registration"
                    className="text-slate-300 transition hover:text-indigo-400"
                  >
                    Hackathon Registration
                  </Link>
                )}
              </div>
            </section>

            {/* Account Email */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="flex items-center gap-2 font-bold">
                <Mail size={18} className="text-indigo-400" />
                Account Email
              </h2>

              <p className="mt-3 break-all text-sm leading-6 text-slate-400">
                {email}
              </p>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
