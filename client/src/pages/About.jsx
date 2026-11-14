import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import {
  Lightbulb,
  Users,
  Code2,
  Laptop,
  ShieldCheck,
  ArrowRight,
  Brain,
  Globe,
  Sparkles,
} from "lucide-react";

// Core objectives
const objectives = [
  {
    icon: Lightbulb,
    title: "Encourage Innovation",
    description:
      "Encourage participants to transform creative ideas into useful, production-grade technology solutions.",
  },
  {
    icon: Users,
    title: "Foster Collaboration",
    description:
      "Promote teamwork, peer communication, and collaborative cross-domain problem solving.",
  },
  {
    icon: Code2,
    title: "Develop Practical Skills",
    description:
      "Give participants hands-on opportunity to build real-world software using modern tech stacks.",
  },
];

// Technology tracks
const tracks = [
  {
    icon: Brain,
    title: "AI / ML",
    description: "Intelligent applications, data-driven solutions, and predictive algorithms.",
  },
  {
    icon: Globe,
    title: "Web Development",
    description: "Modern websites, full-stack web applications, and responsive cloud services.",
  },
  {
    icon: Laptop,
    title: "IoT",
    description: "Connected devices, telemetry dashboards, and smart automation technology.",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    description: "Security-focused systems, identity verification, and privacy preservation.",
  },
  {
    icon: Code2,
    title: "Blockchain",
    description: "Decentralized applications, smart contracts, and Web3 trust architecture.",
  },
];

const About = () => {
  const { user, loading } = useAuth();

  const actionLink = user ? "/dashboard" : "/signup";
  const actionLabel = user ? "Go to Dashboard" : "Register for Hackathon";

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden px-5 py-24 sm:px-8">
          <div
            className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-5xl text-center">
            <p className="font-semibold uppercase tracking-widest text-indigo-400 text-xs">
              About MatruCare AI Hackathon
            </p>

            <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">
              Empowering Next-Gen Innovators
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              <strong>MatruCare AI</strong> is hosting this nationwide hackathon to discover,
              mentor, and reward ambitious developers and engineers who are eager to solve
              pressing challenges through technology.
            </p>
          </div>
        </section>

        {/* ================= ABOUT DETAILS ================= */}
        <section className="border-y border-slate-800 bg-slate-900/40 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Mission &amp; Vision
                </span>

                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Building Solutions for Tomorrow
                </h2>

                <p className="mt-5 text-sm sm:text-base leading-7 text-slate-300">
                  The MatruCare AI Hackathon brings together students and developers from
                  across disciplines to collaborate on real-world projects in AI/ML, Web Development,
                  IoT, Cyber Security, and Blockchain.
                </p>

                <p className="mt-4 text-sm sm:text-base leading-7 text-slate-400">
                  Whether you are building as a solo developer or collaborating in a team of up to
                  5 members, this platform provides transparent registration, dynamic team management,
                  OTP verification, and personalized tracking for every stage of your hackathon journey.
                </p>

                {!loading && (
                  <div className="mt-8">
                    <Link
                      to={actionLink}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
                    >
                      {actionLabel}
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {objectives.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-indigo-500/50"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                        <Icon size={24} />
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-base">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= DOMAINS & TRACKS ================= */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Participation Tracks
              </span>

              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Explore Available Domains
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-400">
                Choose the domain that best fits your project. Cross-functional solutions are also encouraged.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => {
                const Icon = track.icon;

                return (
                  <div
                    key={track.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700"
                  >
                    <div className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-4 font-bold text-white text-base">
                      {track.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {track.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
