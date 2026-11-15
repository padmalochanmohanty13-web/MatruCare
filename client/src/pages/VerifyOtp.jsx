
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  HeartPulse,
  ShieldCheck,
  Mail,
  ArrowRight,
  ArrowLeft,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  Activity,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyOtp, resendOtp } = useAuth();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef([]);

  // Redirect when the verification email is missing.
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer.
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  // Handle individual OTP input.
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError("");
    setSuccess("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Keyboard navigation.
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste complete OTP.
  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = [...otp];

    pastedValue.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setError("");
    setSuccess("");

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await verifyOtp(email, otpValue);

      if (response.success) {
        setSuccess(
          "Email verified successfully! Redirecting to Login..."
        );

        window.setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              email,
              verified: true,
            },
          });
        }, 1200);
      } else {
        setError(response.message || "OTP verification failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP.
  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);
      setError("");
      setSuccess("");

      await resendOtp(email);

      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setSuccess("A new OTP has been sent to your email inbox.");

      inputRefs.current[0]?.focus();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to resend OTP. Please try again.";

      setError(message);

      const remaining =
        err.response?.data?.remainingSeconds ||
        err.response?.data?.retryAfter;

      if (remaining && Number(remaining) > 0) {
        setCountdown(Number(remaining));
      }
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030617] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[150px]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 py-8 sm:px-10 lg:px-16">
        {/* Brand */}
        <Link to="/" className="inline-flex w-fit items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/30">
            <Sparkles size={25} className="text-white" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            MatruCare <span className="text-indigo-400">AI</span>
          </span>
        </Link>

        <main className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Left content */}
          <section className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <ShieldCheck size={17} />
              Secure email verification
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              One step
              <br />
              closer to
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                better care.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-slate-300">
              Verify your email address to activate your MatruCare AI
              account and continue your connected healthcare journey.
            </p>

            <div className="mt-12 grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <ShieldCheck className="mb-5 text-indigo-400" size={27} />
                <h3 className="font-semibold text-white">
                  Account security
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Verify your email to protect your account.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <Activity className="mb-5 text-cyan-400" size={27} />
                <h3 className="font-semibold text-white">
                  Get started
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Complete verification and access your account.
                </p>
              </div>
            </div>
          </section>

          {/* OTP verification card */}
          <section className="mx-auto w-full max-w-[520px]">
            <div className="rounded-[28px] border border-slate-800 bg-[#0f172a]/95 p-7 shadow-2xl shadow-black/30 sm:p-10">
              <div className="mb-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                  <HeartPulse size={29} />
                </div>

                <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                  MatruCare AI
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Verify your email
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Enter the 6-digit verification code sent to your
                  registered email address.
                </p>
              </div>

              {/* Email information */}
              <div className="mb-7 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    <Mail size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      Verification code sent to
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-white">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* OTP inputs */}
                <div>
                  <label className="mb-4 block text-center text-sm font-medium text-slate-200">
                    Enter 6-Digit Code
                  </label>

                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0 ? "one-time-code" : "off"
                        }
                        maxLength={1}
                        value={digit}
                        disabled={loading}
                        aria-label={`OTP digit ${index + 1}`}
                        onChange={(event) =>
                          handleChange(index, event.target.value)
                        }
                        onKeyDown={(event) =>
                          handleKeyDown(index, event)
                        }
                        onPaste={handlePaste}
                        className="h-12 w-10 rounded-xl border border-slate-700 bg-[#070d20] text-center text-xl font-bold text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 sm:h-14 sm:w-12"
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-center text-xs text-slate-500">
                    Check your inbox and spam folder for the code.
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                  >
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success message */}
                {success && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm text-emerald-300"
                  >
                    {success}
                  </div>
                )}

                {/* Verify button */}
                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading && (
                    <LoaderCircle size={19} className="animate-spin" />
                  )}

                  {loading ? "Verifying..." : "Verify OTP & Continue"}

                  {!loading && <ArrowRight size={20} />}
                </button>

                {/* Resend OTP */}
                <div className="border-t border-slate-700 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="text-slate-400">
                      Didn't receive the email?
                    </span>

                    {countdown > 0 ? (
                      <span className="text-slate-500">
                        Resend in{" "}
                        <strong className="text-indigo-400">
                          {countdown}s
                        </strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending || loading}
                        className="inline-flex items-center gap-2 font-semibold text-indigo-400 transition hover:text-cyan-400 disabled:opacity-50"
                      >
                        {resending ? (
                          <>
                            <RefreshCw
                              size={15}
                              className="animate-spin"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={15} />
                            Resend OTP
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Login link */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-700" />
                <span className="text-xs font-medium tracking-widest text-slate-500">
                  MATRUCARE AI
                </span>
                <div className="h-px flex-1 bg-slate-700" />
              </div>

              <p className="text-center text-sm text-slate-400">
                Already verified?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-400 transition hover:text-cyan-400"
                >
                  Login
                </Link>
              </p>
            </div>

            <Link
              to="/signup"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 transition hover:text-indigo-400"
            >
              <ArrowLeft size={16} />
              Back to Create Account
            </Link>
          </section>
        </main>

        <footer className="border-t border-slate-800/70 py-5 text-xs text-slate-500">
          © {new Date().getFullYear()} MatruCare AI. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default VerifyOtp;
