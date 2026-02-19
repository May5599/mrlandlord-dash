"use client";

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.currentTarget);

  const res = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      portfolioSize: formData.get("portfolioSize"),
      message: formData.get("message"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  setLoading(false);

  if (res.ok) {
    setSuccess(true);
  } else {
    alert("Something went wrong");
  }
}


  return (
    <div className="relative min-h-screen bg-white overflow-hidden isolate">

      {/* Soft Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />

      {/* Glow */}
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[140px] opacity-40 -z-10" />

      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold text-gray-900">
            Get Ready to Start Today
          </h1>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Tell us about your property management needs.
            Our team will reach out to help you scale efficiently.
          </p>
        </div>

        {/* Form + Info Layout */}
        <div className="mt-16 grid md:grid-cols-2 gap-16 items-start">

          {/* CONTACT FORM */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">

            {success ? (
              <div className="text-center py-10">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Thank You
                </h3>
                <p className="mt-4 text-gray-600">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company / Portfolio Size
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>1–10 Units</option>
                    <option>10–50 Units</option>
                    <option>50–200 Units</option>
                    <option>200+ Units</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Request Demo"}
                </button>

              </form>
            )}
          </div>

          {/* SIDE INFO SECTION */}
          <div className="space-y-8">

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Why MrLandlord?
              </h3>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Built for operators who demand structure, visibility,
                and scalability. We help you move beyond spreadsheets
                into structured operational growth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
              <h4 className="font-semibold mb-2">
                Enterprise Ready
              </h4>
              <p className="text-sm text-gray-600">
                Multi-property, multi-branch, scalable architecture.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
              <h4 className="font-semibold mb-2">
                Secure Infrastructure
              </h4>
              <p className="text-sm text-gray-600">
                Structured data, controlled access, and operational oversight.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
