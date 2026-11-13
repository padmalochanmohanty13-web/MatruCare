
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
        message: "Please enter your full name.",
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

    if (formData.subject.trim().length < 3) {
      setFeedback({
        type: "error",
        message: "Subject must contain at least 3 characters.",
      });
      return;
    }

    if (formData.message.trim().length < 10) {
      setFeedback({
        type: "error",
        message: "Message must contain at least 10 characters.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setFeedback({
        type: "success",
        message: response.data.message || "Your message has been sent successfully.",
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
            <p className="font-semibold uppercase tracking-widest text-indigo-400">
              Contact Us
            </p>

            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
              Let's Start a Conversation
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
              Have questions about Code-a-Nova or the registration process?
              Send us a message and our team will get back to you.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-5">
            {/* Contact Information */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Mail size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  Email Support
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  For questions about registration, participation, or
                  technical issues, contact our organizing team.
                </p>

                <p className="mt-4 text-sm text-indigo-400">
                  Use the contact form to send your enquiry.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <MessageSquare size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  What Can We Help With?
                </h2>

                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  <li>• Registration assistance</li>
                  <li>• Project submission questions</li>
                  <li>• Team participation enquiries</li>
                  <li>• Technical support</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 lg:col-span-3">
              <h2 className="text-2xl font-bold">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Fill in the details below.
              </p>

              {feedback.message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    feedback.type === "success"
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle size={20} className="shrink-0" />
                  ) : (
                    <AlertCircle size={20} className="shrink-0" />
                  )}

                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Full Name
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email Address
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    minLength={3}
                    maxLength={120}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your enquiry about?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send size={18} />}
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
