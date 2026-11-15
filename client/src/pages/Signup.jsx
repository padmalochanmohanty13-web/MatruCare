
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();

    if (!fullName || !email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (fullName.length < 3) {
      setError("Full name must contain at least 3 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        fullName,
        email,
        password: formData.password,
      });

      navigate("/verify-otp", {
        state: { email },
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-[#070d20] py-4 pl-14 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030617] px-4 py-10 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-700/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      {/* Signup card */}
      <section className="relative z-10 w-full max-w-[650px] rounded-[32px] border border-slate-800 bg-[#0f172a] px-6 py-10 shadow-2xl shadow-black/30 sm:px-10 sm:py-12 lg:px-[50px]">
        {/* Heading */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="mb-5 text-base font-bold tracking-wider text-indigo-400">
              MATRUCARE AI
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-400">
              Enter your details to get started with MatruCare AI.
            </p>
          </div>

          <div className="mt-10 hidden h-[70px] w-[70px] shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400 sm:flex">
            <HeartPulse size={35} strokeWidth={2.2} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-3 block text-base font-medium text-white"
            >
              Full name
            </label>

            <div className="relative">
              <User
                size={21}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400"
              />

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-3 block text-base font-medium text-white"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={21}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-3 block text-base font-medium text-white"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={21}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                required
                minLength={8}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-3 block text-base font-medium text-white"
            >
              Confirm password
            </label>

            <div className="relative">
              <Lock
                size={21}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400"
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={21} />
                ) : (
                  <Eye size={21} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={21} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-9 flex items-center gap-5">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-sm tracking-widest text-slate-500">
            MATRUCARE AI
          </span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Login link */}
        <p className="text-center text-base text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
