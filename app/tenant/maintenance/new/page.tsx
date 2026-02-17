"use client";

import { useState, useEffect } from "react";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

type TenantSession = {
  valid: boolean;
  token: string;
};

type MaintenanceForm = {
  title: string;
  description: string;
  category: string;
  severity: string;
  location: string;
  accessPreference: string;
  allowEntry: boolean;
  images: string[];
};

export default function MaintenancePage() {
  const [session, setSession] = useState<TenantSession | null>(null);

  const [form, setForm] = useState<MaintenanceForm>({
    title: "",
    description: "",
    category: "",
    severity: "",
    location: "",
    accessPreference: "",
    allowEntry: true,
    images: [],
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });

      const data = await res.json();

      if (!data.valid || !data.token) {
        window.location.href = "/tenant/login";
        return;
      }

      setSession(data);
    }

    load();
  }, []);

  if (!session) return <p>Loading...</p>;

  function updateField<K extends keyof MaintenanceForm>(
    key: K,
    value: MaintenanceForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.category || !form.severity) {
      alert("Please fill all required fields");
      return;
    }

    if (!session) return;

    await fetchMutation(api.tenantMaintenance.createRequest, {
      token: session.token,

      title: form.title,
      description: form.description,
      category: form.category,
      severity: form.severity,
      location: form.location,

      accessPreference: form.accessPreference || undefined,
      allowEntry: form.allowEntry,
      images: form.images.length ? form.images : undefined,
    });

    alert("Request submitted");
    window.location.href = "/tenant/dashboard";
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-6">
        Submit Maintenance Request
      </h1>

      <div className="space-y-4">
        <input
          placeholder="Short title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <textarea
          placeholder="Describe the issue"
          className="w-full border p-2 rounded h-28"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Select category</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="hvac">Heating and cooling</option>
          <option value="appliances">Appliances</option>
          <option value="other">Other</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={form.severity}
          onChange={(e) => updateField("severity", e.target.value)}
        >
          <option value="">Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        >
          <option value="">Location</option>
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
          <option value="bedroom">Bedroom</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={form.accessPreference}
          onChange={(e) => updateField("accessPreference", e.target.value)}
        >
          <option value="">Access preference</option>
          <option value="anytime">Any time</option>
          <option value="appointment">By appointment</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.allowEntry}
            onChange={(e) => updateField("allowEntry", e.target.checked)}
          />
          Allow entry if away
        </label>

        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []).map((f) =>
              URL.createObjectURL(f)
            );
            updateField("images", files);
          }}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}