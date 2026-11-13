
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import {
  Lightbulb,
  Users,
  Code2,
  Target,
  Laptop,
  ShieldCheck,
  ArrowRight,
  Trophy,
  Brain,
  Globe,
} from "lucide-react";

// Core objectives
const objectives = [
  {
    icon: Lightbulb,
    title: "Encourage Innovation",
    description:
      "Encourage participants to transform creative ideas into useful technology solutions.",
  },
  {
    icon: Users,
    title: "Build Collaboration",
    description:
      "Promote teamwork, communication, and collaborative problem-solving.",
  },
  {
    icon: Code2,
    title: "Develop Technical Skills",
    description:
      "Give participants an opportunity to demonstrate their programming and development skills.",
  },
];

// Technology tracks
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
    title: "IoT",
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

const About = () => {
  const { user, loading } = useAuth();

  // Determine destination according to authentication state.
  const actionLink = user ? "/dashboard" : "/signup";

  const actionLabel = user
    ? "Go to Dashboard"
    : "Join the Hackathon";

  return (
    <div
      id="top"
      className="min-h-screen bg-slate-950 text-white"
    >
      <Navbar />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden px-5 py-24 sm:px-8">
          <div
            className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-5xl text-center">
            <p className="font-semibold uppercase tracking-widest text-indigo-400">
              About Code-a-Nova
            </p>

            <h1 className="mt-5 text-4xl font-extrabold sm:text-6xl">
              Where Ideas Become
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Innovation
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              Code-a-Nova is a hackathon registration platform designed to
              bring creative minds together to develop, demonstrate, and
              showcase innovative technology solutions.
            </p>

            {!loading && (
              <Link
                to={actionLink}
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-semibold transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
              >
                {actionLabel}
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </section>

        {/* ================= MISSION SECTION ================= */}
        <section className="border-y border-slate-800 bg-slate-900/50 px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <div>
              <p className="font-semibold uppercase tracking-widest text-indigo-400">
                Our Mission
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Turning Creativity into Real Solutions
              </h2>

              <p className="mt-6 leading-8 text-slate-400">
                Our goal is to provide participants with an opportunity to
                explore technology, work in teams, solve practical problems,
                and present their ideas through meaningful projects.
              </p>

              <p className="mt-4 leading-8 text-slate-400">
                Participants can develop their concepts, share prototypes,
                and demonstrate their technical abilities throughout the
                hackathon journey.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                <Target size={34} />
              </div>

              <h3 className="mt-7 text-2xl font-bold">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-400">
                To encourage innovation, strengthen technical capabilities,
                and create an environment where ideas can grow into practical
                technology solutions.
              </p>
            </div>
          </div>
        </section>

        {/* ================= OBJECTIVES SECTION ================= */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="font-semibold uppercase tracking-widest text-indigo-400">
                What We Encourage
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Our Core Objectives
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {objectives.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-indigo-500/50"
                  >
                    <div className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                      <Icon size={28} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= TECHNOLOGY TRACKS ================= */}
        <section className="border-y border-slate-800 bg-slate-900/50 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="font-semibold uppercase tracking-widest text-indigo-400">
                Explore Technology
              </p>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Technology Tracks
              </h2>

              <p className="mt-4 text-slate-400">
                Explore different domains and bring your ideas to life.
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
                    <Icon
                      className="text-indigo-400"
                      size={30}
                    />

                    <h3 className="mt-5 text-lg font-bold">
                      {track.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {track.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= PARTICIPATION CTA ================= */}
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-500/30 bg-indigo-950/30 p-8 text-center sm:p-12">
            <Trophy
              className="mx-auto text-indigo-400"
              size={40}
            />

            <h2 className="mt-5 text-3xl font-extrabold">
              {user
                ? "Continue Your Hackathon Journey"
                : "Ready to Showcase Your Idea?"}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              {user
                ? "Visit your dashboard to view your profile, check your hackathon registration, and manage your project details."
                : "Create your account, complete your registration, and take the first step toward presenting your project."}
            </p>

            {!loading && (
              <Link
                to={actionLink}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-semibold transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
              >
                {actionLabel}
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
