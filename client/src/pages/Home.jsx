
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
} from "lucide-react";

const highlights = [
  {
    icon: Lightbulb,
    title: "Ideas",
    description: "Think differently",
    color: "text-yellow-400",
  },
  {
    icon: Laptop,
    title: "Build",
    description: "Create solutions",
    color: "text-cyan-400",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Work as a team",
    color: "text-emerald-400",
  },
  {
    icon: Trophy,
    title: "Achieve",
    description: "Showcase your work",
    color: "text-orange-400",
  },
];

const features = [
  {
    icon: Brain,
    title: "Explore Innovation",
    description:
      "Explore new ideas and turn creative thinking into meaningful technology solutions.",
  },
  {
    icon: Code2,
    title: "Build Real Projects",
    description:
      "Develop practical projects and demonstrate your technical and problem-solving skills.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Connect with other participants, exchange ideas, and work together as a team.",
  },
  {
    icon: Trophy,
    title: "Showcase Your Work",
    description:
      "Present your project, share your prototype, and demonstrate your creativity.",
  },
];

const tracks = [
  {
    icon: Brain,
    title: "AI / ML",
    description: "Intelligent applications and data-driven solutions.",
  },
  {
    icon: Globe,
    title: "Web Development",
    description: "Modern websites and full-stack applications.",
  },
  {
    icon: Laptop,
    title: "Internet of Things",
    description: "Connected devices and smart technology solutions.",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    description: "Security-focused applications and digital protection.",
  },
  {
    icon: Code2,
    title: "Blockchain",
    description: "Decentralized applications and blockchain concepts.",
  },
];

const Home = () => {
  const { user, loading } = useAuth();

  // Logged-in users go to Dashboard.
  // Visitors go to Signup.
  const primaryLink = user ? "/dashboard" : "/signup";

  const primaryLabel = user
    ? "Go to Dashboard"
    : "Register Now";

  const secondaryLabel = user
    ? "Explore Event"
    : "Explore Event";

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:py-20">
          <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                <Rocket size={17} />
                Innovation starts with an idea
              </div>

              <h1 className="mt-10 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Imagine.
                <br />
                Build.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Innovate.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Welcome to Code-a-Nova, a platform for creative minds to
                collaborate, develop innovative projects, and turn ideas
                into technology-driven solutions.
              </p>

              {/* AUTHENTICATION-AWARE BUTTONS */}
              <div className="mt-10 flex flex-wrap gap-4">
                {!loading && (
                  <Link
                    to={primaryLink}
                    className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-500"
                  >
                    {primaryLabel}
                    <ArrowRight size={19} />
                  </Link>
                )}

                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 rounded-xl border border-slate-700 px-7 py-4 font-semibold text-white transition hover:border-indigo-500 hover:bg-white/5"
                >
                  {secondaryLabel}
                </Link>
              </div>

              {/* PROJECT HIGHLIGHTS */}
              <div className="mt-14 flex flex-wrap gap-10">
                <div>
                  <h3 className="text-2xl font-bold text-white">1–5</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Team Members
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">5+</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Technology Tracks
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">1</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Innovative Goal
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT INNOVATION CARD */}
            <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-950/30 sm:p-9">
              <div className="flex items-center justify-between border-b border-slate-700 pb-6">
                <div>
                  <p className="text-sm text-slate-400">
                    CODE-A-NOVA
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white">
                    Innovation Hub
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                  <Code2 size={32} />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl bg-slate-800 p-6 transition hover:-translate-y-1 hover:bg-slate-700"
                    >
                      <Icon size={29} className={item.color} />

                      <h3 className="mt-6 font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
                <p className="text-sm font-semibold text-indigo-300">
                  YOUR NEXT BIG IDEA STARTS HERE
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  Build something that makes a difference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / INTRODUCTION */}
        <section className="border-y border-slate-800 bg-slate-900/40 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-semibold uppercase tracking-widest text-indigo-400">
                About Code-a-Nova
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Turn Your Ideas Into Innovation
              </h2>

              <p className="mt-6 leading-8 text-slate-400">
                Code-a-Nova brings creative minds together to explore
                technology, develop innovative projects, collaborate
                with teams, and showcase practical solutions.
              </p>

              <Link
                to="/about"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Learn More About Us
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-indigo-500/50"
                  >
                    <div className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                      <Icon size={27} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY TRACKS */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="font-semibold uppercase tracking-widest text-indigo-400">
                Explore Technology
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Technology Tracks
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
                Explore different technology domains and bring your
                ideas to life through innovative projects.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => {
                const Icon = track.icon;

                return (
                  <div
                    key={track.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-indigo-500/50"
                  >
                    <div className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                      <Icon size={28} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {track.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {track.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 to-slate-900 p-8 text-center sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
              {user ? (
                <Target size={34} />
              ) : (
                <Sparkles size={34} />
              )}
            </div>

            <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
              {user
                ? "Welcome Back to Code-a-Nova!"
                : "Ready to Build Something Amazing?"}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              {user
                ? "Continue your journey, review your hackathon registration, and keep moving your project forward."
                : "Join Code-a-Nova, showcase your creativity, and turn your technical skills into meaningful solutions."}
            </p>

            {!loading && (
              <Link
                to={primaryLink}
                className="mt-9 inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-indigo-500"
              >
                {user ? "Go to Dashboard" : "Create Your Account"}
                <ArrowRight size={19} />
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
