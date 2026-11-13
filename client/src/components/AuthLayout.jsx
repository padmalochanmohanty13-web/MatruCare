
import { Link } from "react-router-dom";
import { Code2, ArrowLeft } from "lucide-react";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md">

        {/* Brand */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2"
          aria-label="Code-a-Nova home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
            <Code2 size={25} />
          </span>

          <span className="text-2xl font-bold tracking-tight">
            Code-a-<span className="text-indigo-400">Nova</span>
          </span>
        </Link>

        {/* Authentication Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {subtitle}
            </p>
          </div>

          {children}

          {/* Footer Link */}
          {footerText && footerLinkText && footerLinkTo && (
            <p className="mt-6 text-center text-sm text-slate-400">
              {footerText}{" "}
              <Link
                to={footerLinkTo}
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </section>

        {/* Back to Home */}
        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <p className="mt-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Code-a-Nova. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
