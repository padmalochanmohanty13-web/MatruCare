
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout.jsx";
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

  // Redirect if the verification email is missing.
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // Resend countdown.
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

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

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

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
        setSuccess("Email verified successfully! Redirecting to login...");

        window.setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: { email, verified: true },
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

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);
      setError("");
      setSuccess("");

      await resendOtp(email);

      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setSuccess("A new OTP has been sent to your email.");

      inputRefs.current[0]?.focus();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to resend OTP. Please try again.";

      setError(message);

      // Respect a server-provided cooldown if available.
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
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the 6-digit verification code sent to your email address."
      footerText="Already verified?"
      footerLinkText="Login"
      footerLinkTo="/login"
    >
      <div className="mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4 text-center">
        <ShieldCheck
          size={32}
          className="mx-auto mb-2 text-indigo-400"
        />

        <p className="text-sm text-slate-300">
          Verification code sent to
        </p>

        <p className="mt-1 break-all font-semibold text-white">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* OTP Inputs */}
        <div>
          <label className="mb-3 block text-center text-sm font-medium text-slate-200">
            Enter Verification Code
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
                autoComplete={index === 0 ? "one-time-code" : "off"}
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
                className="h-12 w-10 rounded-lg border border-slate-700 bg-slate-800 text-center text-xl font-bold text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:h-14 sm:w-12"
              />
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            role="status"
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-300"
          >
            {success}
          </div>
        )}

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading || otp.some((digit) => !digit)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle size={19} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="mb-2 text-sm text-slate-400">
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300 disabled:cursor-not-allowed disabled:text-slate-500"
          >
            {resending ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend OTP in ${countdown}s`
            ) : (
              <>
                <RefreshCw size={15} />
                Resend OTP
              </>
            )}
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Signup
      </button>
    </AuthLayout>
  );
};

export default VerifyOtp;
