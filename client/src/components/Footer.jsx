
import { Link, useNavigate } from "react-router-dom";
import { Code2, Mail, ArrowUp, LayoutDashboard, LogOut } from "lucide-react";
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

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                <Code2 size={22} />
              </span>
              Code-a-Nova
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Imagine, build, and innovate. Turn your ideas into meaningful
              technology solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="transition hover:text-indigo-400" to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="transition hover:text-indigo-400" to="/about">
                  About
                </Link>
              </li>

              <li>
                <Link className="transition hover:text-indigo-400" to="/contact">
                  Contact
                </Link>
              </li>

              {!loading && (
                <li>
                  <Link
                    className="transition hover:text-indigo-400"
                    to={user ? "/dashboard" : "/signup"}
                  >
                    {user ? "Dashboard" : "Register"}
                  </Link>
                </li>
              )}
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
                        Create Account
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

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">Get in Touch</h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Have a question about the hackathon? Visit our contact page.
            </p>

            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Contact Us
              <Mail size={16} />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {currentYear} Code-a-Nova. All rights reserved.</p>

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
