"use client";

import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";


/* -------------------- TYPES -------------------- */

type Occupant = {
  fullName: string;
  phone?: string;
  relationship?: string;
};

type Pet = {
  type: string;
  size: string;
};

type EmergencyContact = {
  name?: string;
  phone?: string;
  relationship?: string;
};

type TenantProfileForm = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  phone?: string;

  employmentStatus?: string;
  employerName?: string;
  jobTitle?: string;
  monthlyIncome?: number;

  occupants?: Occupant[];
  vehicle?: {
    model?: string;
    plate?: string;
  };
  pets?: Pet[];
  emergencyContact?: EmergencyContact;
  notes?: string;
};

type TenantProfileRecord = TenantProfileForm & {
  _id: string;
};

/* -------------------- COMPONENT -------------------- */

export default function TenantProfile() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<TenantProfileRecord | null>(null);
  const [openSection, setOpenSection] = useState<string>("personal");
  const [tenantId, setTenantId] = useState<Id<"tenants"> | null>(null);


  const [form, setForm] = useState<TenantProfileForm>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    phone: "",
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    monthlyIncome: undefined,
    occupants: [],
    vehicle: { model: "", plate: "" },
    pets: [],
    emergencyContact: { name: "", phone: "", relationship: "" },
    notes: "",
  });

  /* -------------------- LOAD SESSION + PROFILE -------------------- */

useEffect(() => {
  async function load() {
    const res = await fetch("/api/tenant/get-session", {
      credentials: "include",
    });

    const session: {
      valid: boolean;
      token?: string;
      tenantId?: Id<"tenants">;
    } = await res.json();

    if (!session.valid || !session.token || !session.tenantId) {
      window.location.href = "/tenant/login";
      return;
    }

    // ✅ set BOTH first
    setToken(session.token);
    setTenantId(session.tenantId);

    // ✅ use session.token directly (NOT state)
    const existingProfile = await fetchQuery(
      api.tenantProfiles.getProfile,
      {
        token: session.token,
        tenantId: session.tenantId,
      }
    );

    if (existingProfile) {
      setProfile(existingProfile as TenantProfileRecord);
      setForm(existingProfile);
    }
  }

  load();
}, []);


  /* -------------------- SAVE HANDLER -------------------- */

  async function saveSection() {
    if (!token) return;

    const cleaned: TenantProfileForm = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      dob: form.dob,
      phone: form.phone,

      employmentStatus: form.employmentStatus,
      employerName: form.employerName,
      jobTitle: form.jobTitle,
      monthlyIncome: form.monthlyIncome,

      occupants: form.occupants,
      vehicle: form.vehicle,
      pets: form.pets,
      emergencyContact: form.emergencyContact,
      notes: form.notes,
    };

   if (!profile && tenantId) {
  const res = await fetchMutation(api.tenantProfiles.createProfile, {
    token,
    tenantId,
    ...cleaned,
  });

  setProfile({
    _id: res.profileId,
    ...cleaned,
  });
} else if (profile) {
  await fetchMutation(api.tenantProfiles.updateProfile, {
    token,
    // profileId: profile._id,
    profileId: profile._id as Id<"tenantProfiles">,

    data: cleaned,
  });
}



    alert("Profile saved successfully!");
  }

  function toggle(section: string) {
    setOpenSection((prev) => (prev === section ? "" : section));
  }

  if (!token) return <p className="p-6">Loading...</p>;

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center mb-10">
        <div className="w-28 h-28 bg-gray-200 rounded-full mb-3 border flex items-center justify-center text-gray-500">
          Photo
        </div>
        <h2 className="text-2xl font-semibold">
          {form.firstName || "Your"} {form.lastName || "Profile"}
        </h2>
        <p className="text-gray-600 text-sm">(Editable Profile)</p>
      </div>

      <div className="space-y-4">

        <Accordion
          title="Personal Information"
          open={openSection === "personal"}
          onClick={() => toggle("personal")}
        >
          <Input label="First Name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
          <Input label="Middle Name" value={form.middleName} onChange={(v) => setForm({ ...form, middleName: v })} />
          <Input label="Last Name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
          <Input type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} />
          <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <SaveButton onClick={saveSection} />
        </Accordion>

        <Accordion
          title="Employment & Income"
          open={openSection === "employment"}
          onClick={() => toggle("employment")}
        >
          <Input label="Employer" value={form.employerName} onChange={(v) => setForm({ ...form, employerName: v })} />
          <Input label="Job Title" value={form.jobTitle} onChange={(v) => setForm({ ...form, jobTitle: v })} />
          <Input label="Monthly Income" value={form.monthlyIncome?.toString()} onChange={(v) =>
            setForm({ ...form, monthlyIncome: v ? Number(v) : undefined })
          } />
          <SaveButton onClick={saveSection} />
        </Accordion>

        <Accordion
          title="Emergency Contact"
          open={openSection === "emergency"}
          onClick={() => toggle("emergency")}
        >
          <Input label="Name" value={form.emergencyContact?.name} onChange={(v) =>
            setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: v } })
          } />
          <Input label="Phone" value={form.emergencyContact?.phone} onChange={(v) =>
            setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: v } })
          } />
          <Input label="Relationship" value={form.emergencyContact?.relationship} onChange={(v) =>
            setForm({ ...form, emergencyContact: { ...form.emergencyContact, relationship: v } })
          } />
          <SaveButton onClick={saveSection} />
        </Accordion>

      </div>
    </div>
  );
}

/* -------------------- REUSABLE UI -------------------- */

type AccordionProps = {
  title: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function Accordion({ title, open, onClick, children }: AccordionProps) {
  return (
    <div className="border rounded-lg bg-white">
      <button onClick={onClick} className="w-full p-4 flex justify-between font-semibold">
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
      Save
    </button>
  );
}

type InputProps = {
  label?: string;
  value?: string;
  type?: string;
  onChange: (value: string) => void;
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <input
      type={type}
      placeholder={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-3 px-3 py-2 border rounded"
    />
  );
}
