import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import {
  ArrowRight,
  Rocket,
  Lightbulb,
  Laptop,
  Users,
  Trophy,
  Code2,
  Brain,
  Globe,
  ShieldCheck,
  Sparkles,
  Target,
  Calendar,
  Gift,
  Medal,
  Award,
  CheckCircle2,
  LogIn,
} from "lucide-react";

const highlights = [
  {
    icon: Lightbulb,
    title: "Innovate",
    description: "Brainstorm real-world ideas",
    color: "text-yellow-400",
  },
  {
    icon: Laptop,
    title: "Build",
    description: "Full-stack practical prototypes",
    color: "text-cyan-400",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "1 to 5 members per team",
    color: "text-emerald-400",
  },
  {
    icon: Trophy,
    title: "Win Prizes",
    description: "Cash rewards & internships",
    color: "text-amber-400",
  },
];

const timelineSteps = [
  {
    step: "01",
    phase: "Registration & Team Formation",
    date: "May 24 – June 10, 2026",
    description: "Sign up on the portal, verify your email via 6-digit OTP, assemble your team (1-5 members), and register your project.",
    status: "Active",
  },
  {
    step: "02",
    phase: "Idea & PPT Submission",
    date: "June 11 – June 20, 2026",
    description: "Submit your presentation slides (Google Drive / OneDrive) and project prototype link (GitHub / Figma / Live Demo).",
    status: "Upcoming",
  },
  {
    step: "03",
    phase: "Shortlisting & Mentorship",
    date: "June 21 – June 25, 2026",
    description: "Top teams will be evaluated by industry judges and receive 1-on-1 mentorship sessions to refine their solutions.",
    status: "Upcoming",
  },
  {
    step: "04",
    phase: "Grand Finale & Demo Day",
    date: "June 28 – June 30, 2026",
    description: "Live pitch, code presentation, winner announcements, and distribution of cash prizes and internship offers.",
    status: "Upcoming",
  },
];

const prizes = [
  {
    icon: Trophy,
    rank: "1st Prize — Grand Winner",
    amount: "₹50,000",
    badge: "Winner",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    cardBg: "from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40",
    perks: [
      "₹50,000 Direct Cash Prize",
      "MatruCare AI Winner Trophy",
      "Certificate of Excellence",
      "Guaranteed Internship Opportunity at MatruCare AI",
      "VIP Access to Founder Mentorship Sessions",
    ],
  },
  {
    icon: Medal,
    rank: "2nd Prize — Runner Up",
    amount: "₹30,000",
    badge: "Runner Up",
    badgeColor: "bg-slate-400/20 text-slate-300 border-slate-400/30",
    cardBg: "from-slate-800/40 via-slate-900 to-slate-900 border-slate-700",
    perks: [
      "₹30,000 Direct Cash Prize",
      "MatruCare AI Runner-Up Trophy",
      "Certificate of Merit",
      "Interview Fast-Track for Internship Positions",
      "Exclusive MatruCare AI Swag Pack",
    ],
  },
  {
    icon: Award,
    rank: "3rd Prize — 2nd Runner Up",
    amount: "₹15,000",
    badge: "2nd Runner Up",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    cardBg: "from-orange-950/30 via-slate-900 to-slate-900 border-slate-700",
    perks: [
      "₹15,000 Direct Cash Prize",
      "MatruCare AI Trophy",
      "Certificate of Merit",
      "Fast-Track Mentorship Review",
      "MatruCare AI Goodies & Cloud Credits",
    ],
  },
];

const tracks = [
  {
    icon: Brain,
    title: "AI / ML Track",
    description: "Machine learning, computer vision, healthcare AI, predictive models, and intelligent assistants.",
  },
  {
    icon: Globe,
    title: "Web Dev Track",
    description: "Full-stack modern web applications, scalable APIs, accessible platforms, and progressive web apps.",
  },
  {
    icon: Laptop,
    title: "IoT Track",
    description: "Smart connected hardware, sensor telemetry, edge computing, smart home and healthcare devices.",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security Track",
    description: "Application security, identity verification, cryptographic safeguards, and privacy-preserving tools.",
  },
  {
    icon: Code2,
    title: "Blockchain Track",
    description: "Decentralized applications, smart contracts, transparent records, and Web3 solutions.",
  },
  {
    icon: Sparkles,
    title: "Open Innovation Track",
    description: "Cross-disciplinary ideas solving societal challenges and healthcare dilemmas.",
  },
];

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:py-24">
          <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                <Rocket size={17} />
                <span>MatruCare AI Hackathon 2026 • Registration Live</span>
              </div>

              <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Code. Innovate.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Transform Futures.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Welcome to the official <strong>MatruCare AI Hackathon Portal</strong>.
                Form teams of 1 to 5 members, register your breakthrough technology project,
                and compete for ₹1,00,000+ in prizes and prestigious internship opportunities.
              </p>

              {/* HERO CTA BUTTONS (Register Now / Login) */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {!loading && (
                  user ? (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                    >
                      Go to Dashboard
                      <ArrowRight size={19} />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                      >
                        Register Now
                        <ArrowRight size={19} />
                      </Link>

                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-7 py-4 font-semibold text-white transition hover:border-indigo-500 hover:bg-slate-800"
                      >
                        <LogIn size={18} />
                        Login
                      </Link>
                    </>
                  )
                )}

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 underline underline-offset-4 transition hover:text-white"
                >
                  Learn more about the hackathon →
                </Link>
              </div>

              {/* Key Quick Highlights */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-800 pt-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">1–5</h3>
                  <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider">Team Size</p>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">₹1,00,000+</h3>
                  <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider">Prize Pool</p>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">5+</h3>
                  <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider">Tracks</p>
                </div>
              </div>
            </div>

            {/* Right Innovation Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-950/40 sm:p-9">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    MatruCare AI
                  </p>
                  <h2 className="mt-1.5 text-xl font-bold text-white">
                    Hackathon Portal 2026
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                  <Sparkles size={30} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-slate-700"
                    >
                      <Icon size={26} className={item.color} />

                      <h3 className="mt-4 font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                  <Target size={18} />
                  <span>Full Stack Developer Internship Track</span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  Built with MongoDB, Express.js, React.js, Node.js, and Nodemailer.
                  Automated OTP verification &amp; instant confirmation emails.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TIMELINE SECTION ================= */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                <Calendar size={14} />
                Schedule &amp; Milestones
              </div>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Event Timeline
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-sm sm:text-base">
                Follow key dates to make sure your team doesn't miss out on submissions,
                reviews, and live presentations.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {timelineSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-indigo-500/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-indigo-500/30">
                        {item.step}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white">
                      {item.phase}
                    </h3>

                    <p className="mt-1.5 text-xs font-semibold text-indigo-400">
                      {item.date}
                    </p>

                    <p className="mt-3 text-xs leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PRIZES & REWARDS ================= */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <Gift size={14} />
                Rewards &amp; Opportunities
              </div>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Hackathon Prizes
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-sm sm:text-base">
                Exciting cash awards, trophies, certificates, and full-time internship
                opportunities await the best teams.
              </p>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {prizes.map((prize) => {
                const Icon = prize.icon;

                return (
                  <div
                    key={prize.rank}
                    className={`rounded-3xl border bg-gradient-to-b p-7 transition hover:-translate-y-1 ${prize.cardBg}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <Icon size={26} />
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${prize.badgeColor}`}
                      >
                        {prize.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-white">
                      {prize.rank}
                    </h3>

                    <div className="mt-3 text-4xl font-extrabold tracking-tight text-white">
                      {prize.amount}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        What You Win:
                      </p>

                      <ul className="mt-4 space-y-3">
                        {prize.perks.map((perk, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2.5 text-xs leading-5 text-slate-300"
                          >
                            <CheckCircle2
                              size={16}
                              className="shrink-0 text-emerald-400 mt-0.5"
                            />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special category bonus */}
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
              <div>
                <h4 className="font-bold text-white">
                  Special Category Awards &amp; Certificates
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  Best All-Girls Team, Best First-Year Team, and Track Champions also win special swags, cloud credits &amp; certificates.
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
                >
                  Participate Now
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TECHNOLOGY TRACKS ================= */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="font-semibold uppercase tracking-widest text-indigo-400 text-xs">
                Choose Your Domain
              </p>

              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Technology Tracks
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-sm">
                Build solutions in any of our 5 official hackathon tracks. All tracks are eligible for the Grand Prizes.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => {
                const Icon = track.icon;

                return (
                  <div
                    key={track.title}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-indigo-500/50"
                  >
                    <div className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                      <Icon size={26} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white">
                      {track.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-400">
                      {track.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FINAL CALL TO ACTION ================= */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 p-8 text-center sm:p-14 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Sparkles size={34} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              {user
                ? "Welcome back to MatruCare AI!"
                : "Ready to Register for MatruCare AI Hackathon?"}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base leading-7">
              {user
                ? "Check your dashboard, view your registration status, update your project resources, or complete your submission."
                : "Join fellow innovators, showcase your engineering skills, and create impactful technology. Free registration for all verified student participants."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {!loading && (
                user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-indigo-500"
                  >
                    Open Dashboard
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
                    >
                      Register Now
                      <ArrowRight size={18} />
                    </Link>

                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white transition hover:border-indigo-500 hover:bg-slate-800"
                    >
                      <LogIn size={18} />
                      Login
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
