import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api.js";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    if (formData.name.trim().length < 2) {
      setFeedback({
        type: "error",
        message: "Please enter your full name (minimum 2 characters).",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (formData.message.trim().length < 5) {
      setFeedback({
        type: "error",
        message: "Message must contain at least 5 characters.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "Hackathon Portal Enquiry",
        message: formData.message.trim(),
      });

      setFeedback({
        type: "success",
        message:
          response.data.message ||
          "Your message has been sent successfully to matrucareai@gmail.com.",
      });

      setFormData(initialForm);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to send your message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-indigo-400 text-xs">
              Get in Touch
            </p>

            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
              Contact MatruCare AI
            </h1>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400 text-sm sm:text-base">
              Have questions about the MatruCare AI Hackathon, rules, eligibility,
              or registration process? Reach out to us directly or fill in the form below.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-5">
            {/* Contact Information */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Mail size={24} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  Official Email
                </h2>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Our organizing committee actively monitors the hackathon inbox:
                </p>

                <a
                  href="mailto:matrucareai@gmail.com"
                  className="mt-3 inline-block font-mono text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                  matrucareai@gmail.com
                </a>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <MessageSquare size={24} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  What We Support
                </h2>

                <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                  <li>• Hackathon registration and team size inquiries</li>
                  <li>• Email OTP delivery &amp; verification assistance</li>
                  <li>• Submission guidelines &amp; presentation requirements</li>
                  <li>• Mentorship schedule &amp; evaluation criteria</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 lg:col-span-3">
              <h2 className="text-2xl font-bold">
                Send Us a Message
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Direct queries will be answered via email from <strong>matrucareai@gmail.com</strong>.
              </p>

              {feedback.message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-xs ${
                    feedback.type === "success"
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle size={18} className="shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0" />
                  )}

                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-semibold text-slate-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-semibold text-slate-300">
                    Email Address <span className="text-red-400">*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-xs font-semibold text-slate-300">
                    Subject (Optional)
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    maxLength={120}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Team Registration Question"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold text-slate-300">
                    Message <span className="text-red-400">*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={5}
                    maxLength={3000}
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send size={16} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
