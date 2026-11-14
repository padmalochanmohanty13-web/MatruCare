import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  ArrowUp,
  LayoutDashboard,
  LogOut,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Footer = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand & Socials */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2.5 text-xl font-bold text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-md shadow-indigo-600/30">
                <Sparkles size={22} className="text-white" />
              </span>
              <span>
                MatruCare <span className="text-indigo-400">AI</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              MatruCare AI Hackathon Portal — Empowering innovators, developers,
              and problem-solvers to turn breakthrough ideas into real-world impact.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500 hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500 hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.3a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500 hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://matrucare.ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500 hover:text-white"
              >
                <Globe size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Navigation</h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="transition hover:text-indigo-400" to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="transition hover:text-indigo-400" to="/about">
                  About Hackathon
                </Link>
              </li>

              <li>
                <Link className="transition hover:text-indigo-400" to="/contact">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  className="transition hover:text-indigo-400"
                  to={user ? "/registration" : "/signup"}
                >
                  Hackathon Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white">Your Account</h3>

            {!loading && (
              <ul className="mt-4 space-y-3 text-sm">
                {user ? (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 transition hover:text-indigo-400"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 transition hover:text-red-400"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="transition hover:text-indigo-400"
                      >
                        Login
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/signup"
                        className="transition hover:text-indigo-400"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}

            {loading && (
              <p className="mt-4 text-sm text-slate-500">
                Loading account...
              </p>
            )}
          </div>

          {/* Contact Email & Support */}
          <div>
            <h3 className="font-semibold text-white">Contact & Support</h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Have questions regarding the hackathon, team eligibility, or submissions?
            </p>

            <a
              href="mailto:matrucareai@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              <Mail size={16} />
              matrucareai@gmail.com
            </a>

            <div className="mt-3">
              <Link
                to="/contact"
                className="text-xs text-slate-400 underline transition hover:text-white"
              >
                Or send us a message via Contact Form →
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {currentYear} MatruCare AI. All rights reserved.</p>

          <a
            href="#top"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            Back to top
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
