"use client";

import { useEffect, useState } from "react";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* =========================================================
   TYPES
========================================================= */

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type DocumentType = "photo_id" | "pay_stub" | "credit_report";

type Address = {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
};

type Vehicle = {
  make?: string;
  model?: string;
  plate?: string;
  color?: string;
};

type Pet = {
  name?: string;
  type: string;
  breed?: string;
  size?: string;
  weight?: number;
};

type Occupant = {
  fullName: string;
  phone?: string;
  relationship?: string;
};

type Document = {
  type: DocumentType;
  storageId: string;
  uploadedAt: number;
};

type TenantProfile = {
  _id?: Id<"tenantProfiles">;
  applicationCompleted?: boolean;

  profileImageId?: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  phone?: string;
  weight?: number;

  idType?: string;
  idNumber?: string;
  idExpiry?: string;
  citizenshipStatus?: string;

  currentAddress?: Address;
  previousAddress?: Address;

  employmentStatus?: string;
  employerName?: string;
  employerPhone?: string;
  employerEmail?: string;
  jobTitle?: string;
  employmentDuration?: string;
  monthlyIncome?: number;

  vehicle?: Vehicle;
  pets?: Pet[];
  occupants?: Occupant[];
  documents?: Document[];

  accuracyConfirmed?: boolean;
  creditCheckConsent?: boolean;

  notes?: string;
};

/* =========================================================
   SANITIZER
   Removes system fields before update
========================================================= */

function buildUpdatePayload(profile: TenantProfile) {
  return {
    profileImageId: profile.profileImageId,
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    dob: profile.dob,
    phone: profile.phone,
    weight: profile.weight,
    idType: profile.idType,
    idNumber: profile.idNumber,
    idExpiry: profile.idExpiry,
    citizenshipStatus: profile.citizenshipStatus,
    currentAddress: profile.currentAddress,
    previousAddress: profile.previousAddress,
    employmentStatus: profile.employmentStatus,
    employerName: profile.employerName,
    employerPhone: profile.employerPhone,
    employerEmail: profile.employerEmail,
    jobTitle: profile.jobTitle,
    employmentDuration: profile.employmentDuration,
    monthlyIncome: profile.monthlyIncome,
    vehicle: profile.vehicle,
    pets: profile.pets,
    occupants: profile.occupants,
    documents: profile.documents,
    accuracyConfirmed: profile.accuracyConfirmed,
    creditCheckConsent: profile.creditCheckConsent,
    notes: profile.notes,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TenantApplicationPage() {

  const [step, setStep] = useState<Step>(1);
  const [token, setToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<Id<"tenants"> | null>(null);
  const [profile, setProfile] = useState<TenantProfile>({});
  const [loading, setLoading] = useState(true);

  /* ================= LOAD SESSION ================= */

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });

      const session = await res.json();

      if (!session.valid) {
        window.location.href = "/tenant/login";
        return;
      }

      setToken(session.token);
      setTenantId(session.tenantId);

      // const existing = await fetchQuery(
      //   api.tenantProfiles.getProfile,
      //   {
      //     token: session.token,
      //     tenantId: session.tenantId,
      //   }
      // );

      const existing = await fetchQuery(
  api.tenantProfiles.getProfile,
  {
    token: session.token,
  }
);

      if (existing) setProfile(existing);

      setLoading(false);
    }

    init();
  }, []);

  /* ================= SAVE ================= */

  async function saveDraft() {
    if (!token || !tenantId) return;

    const payload = buildUpdatePayload(profile);

    if (!profile._id) {
      const res = await fetchMutation(
        api.tenantProfiles.createProfile,
        {
          token,
          tenantId,
          ...payload,
        }
      );

      setProfile({ ...profile, _id: res.profileId });
    } else {
      await fetchMutation(
        api.tenantProfiles.updateProfile,
        {
          token,
          profileId: profile._id,
          data: payload,
        }
      );
    }

    alert("Draft saved");
  }

  /* ================= SUBMIT ================= */

  async function submitApplication() {
    if (!token || !profile._id) return;

    const payload = buildUpdatePayload(profile);

    await fetchMutation(
      api.tenantProfiles.updateProfile,
      {
        token,
        profileId: profile._id,
        data: payload,
      }
    );

    await fetchMutation(
      api.tenantProfiles.submitApplication,
      {
        token,
        profileId: profile._id,
      }
    );

    setProfile({ ...profile, applicationCompleted: true });

    alert("Application submitted");
  }

  /* ================= FILE UPLOAD ================= */

async function uploadProfileImage(file: File) {
  if (!token) return;

  const uploadUrl = await fetchMutation(
    api.storage.generateUploadUrl,
    {}
  );

  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!result.ok) {
    alert("Upload failed");
    return;
  }

  const { storageId }: { storageId: string } =
    await result.json();

  setProfile((prev) => ({
    ...prev,
    profileImageId: storageId,
  }));
}

async function uploadFile(
  file: File,
  type: DocumentType
) {
  if (!token) return;

  const uploadUrl = await fetchMutation(
    api.storage.generateUploadUrl,
    {}
  );

  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!result.ok) {
    alert("Upload failed");
    return;
  }

  const { storageId }: { storageId: string } =
    await result.json();

  setProfile((prev) => ({
    ...prev,
    documents: [
      ...(prev.documents ?? []),
      {
        type,
        storageId,
        uploadedAt: Date.now(),
      },
    ],
  }));
}

function removeDocument(index: number) {
  setProfile((prev) => {
    const docs = [...(prev.documents ?? [])];
    docs.splice(index, 1);
    return { ...prev, documents: docs };
  });
}


  if (loading) return <p className="p-6">Loading...</p>;

  const readOnly = profile.applicationCompleted;

  return (
    <div className="max-w-4xl mx-auto p-6">

      <ProgressBar step={step} />

     {step === 1 && (
  <Section title="Personal Information">

    <Input
      label="First Name"
      value={profile.firstName}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, firstName: v })
      }
    />

    <Input
      label="Middle Name"
      value={profile.middleName}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, middleName: v })
      }
    />

    <Input
      label="Last Name"
      value={profile.lastName}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, lastName: v })
      }
    />

    <Input
      label="Date of Birth"
      value={profile.dob}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, dob: v })
      }
    />

    <Input
      label="Phone"
      value={profile.phone}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, phone: v })
      }
    />

    <Input
      label="Weight"
      value={profile.weight}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          weight: v ? Number(v) : undefined,
        })
      }
    />

    {profile.profileImageId && (
      <p className="text-sm text-green-600 mb-2">
        Profile image uploaded
      </p>
    )}

    {!readOnly && (
      <FileInput
        label="Upload Profile Image"
        onFile={uploadProfileImage}
      />
    )}

  </Section>
)}


{step === 2 && (
  <Section title="Address Information">

    <h3 className="font-semibold mb-2">Current Address</h3>

    <Input
      label="Street"
      value={profile.currentAddress?.street}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          currentAddress: {
            ...profile.currentAddress,
            street: v,
          },
        })
      }
    />

    <Input
      label="City"
      value={profile.currentAddress?.city}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          currentAddress: {
            ...profile.currentAddress,
            city: v,
          },
        })
      }
    />

    <Input
      label="Province"
      value={profile.currentAddress?.province}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          currentAddress: {
            ...profile.currentAddress,
            province: v,
          },
        })
      }
    />

    <Input
      label="Postal Code"
      value={profile.currentAddress?.postalCode}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          currentAddress: {
            ...profile.currentAddress,
            postalCode: v,
          },
        })
      }
    />

    <hr className="my-4" />

    <h3 className="font-semibold mb-2">Previous Address</h3>

    <Input
      label="Street"
      value={profile.previousAddress?.street}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          previousAddress: {
            ...profile.previousAddress,
            street: v,
          },
        })
      }
    />

  </Section>
)}


{step === 3 && (
  <Section title="Identification Details">

    <Input
      label="ID Type"
      value={profile.idType}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, idType: v })
      }
    />

    <Input
      label="ID Number"
      value={profile.idNumber}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, idNumber: v })
      }
    />

    <Input
      label="ID Expiry"
      value={profile.idExpiry}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, idExpiry: v })
      }
    />

    <Input
      label="Citizenship Status"
      value={profile.citizenshipStatus}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, citizenshipStatus: v })
      }
    />

  </Section>
)}


{step === 4 && (
  <Section title="Employment Information">

    <Input
      label="Employment Status"
      value={profile.employmentStatus}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, employmentStatus: v })
      }
    />

    <Input
      label="Employer Name"
      value={profile.employerName}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, employerName: v })
      }
    />

    <Input
      label="Employer Phone"
      value={profile.employerPhone}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, employerPhone: v })
      }
    />

    <Input
      label="Employer Email"
      value={profile.employerEmail}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, employerEmail: v })
      }
    />

    <Input
      label="Job Title"
      value={profile.jobTitle}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, jobTitle: v })
      }
    />

    <Input
      label="Employment Duration"
      value={profile.employmentDuration}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({ ...profile, employmentDuration: v })
      }
    />

    <Input
      label="Monthly Income"
      value={profile.monthlyIncome}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          monthlyIncome: v ? Number(v) : undefined,
        })
      }
    />

  </Section>
)}


{step === 5 && (
  <Section title="Vehicle & Pets">

    {/* VEHICLE */}
    <h3 className="font-semibold mb-2">Vehicle</h3>

    <Input
      label="Make"
      value={profile.vehicle?.make}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          vehicle: { ...profile.vehicle, make: v },
        })
      }
    />

    <Input
      label="Model"
      value={profile.vehicle?.model}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          vehicle: { ...profile.vehicle, model: v },
        })
      }
    />

    <Input
      label="Plate"
      value={profile.vehicle?.plate}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          vehicle: { ...profile.vehicle, plate: v },
        })
      }
    />

    <Input
      label="Color"
      value={profile.vehicle?.color}
      disabled={readOnly}
      onChange={(v) =>
        setProfile({
          ...profile,
          vehicle: { ...profile.vehicle, color: v },
        })
      }
    />

    <hr className="my-4" />

    {/* PETS */}
    <h3 className="font-semibold mb-2">Pets</h3>

    {!readOnly && (
      <button
        className="mb-3 px-3 py-1 border rounded"
        onClick={() =>
          setProfile({
            ...profile,
            pets: [
              ...(profile.pets ?? []),
              { type: "" },
            ],
          })
        }
      >
        Add Pet
      </button>
    )}

    {profile.pets?.map((pet, index) => (
      <div key={index} className="border p-3 mb-3 rounded">

        <Input
          label="Name"
          value={pet.name}
          disabled={readOnly}
          onChange={(v) => {
            const pets = [...(profile.pets ?? [])];
            pets[index].name = v;
            setProfile({ ...profile, pets });
          }}
        />

        <Input
          label="Type"
          value={pet.type}
          disabled={readOnly}
          onChange={(v) => {
            const pets = [...(profile.pets ?? [])];
            pets[index].type = v;
            setProfile({ ...profile, pets });
          }}
        />

        <Input
          label="Breed"
          value={pet.breed}
          disabled={readOnly}
          onChange={(v) => {
            const pets = [...(profile.pets ?? [])];
            pets[index].breed = v;
            setProfile({ ...profile, pets });
          }}
        />

      </div>
    ))}

  </Section>
)}

{step === 6 && (
  <Section title="Occupants">

    {!readOnly && (
      <button
        className="mb-3 px-3 py-1 border rounded"
        onClick={() =>
          setProfile({
            ...profile,
            occupants: [
              ...(profile.occupants ?? []),
              { fullName: "" },
            ],
          })
        }
      >
        Add Occupant
      </button>
    )}

    {profile.occupants?.map((occ, index) => (
      <div key={index} className="border p-3 mb-3 rounded">

        <Input
          label="Full Name"
          value={occ.fullName}
          disabled={readOnly}
          onChange={(v) => {
            const occupants = [...(profile.occupants ?? [])];
            occupants[index].fullName = v;
            setProfile({ ...profile, occupants });
          }}
        />

        <Input
          label="Phone"
          value={occ.phone}
          disabled={readOnly}
          onChange={(v) => {
            const occupants = [...(profile.occupants ?? [])];
            occupants[index].phone = v;
            setProfile({ ...profile, occupants });
          }}
        />

        <Input
          label="Relationship"
          value={occ.relationship}
          disabled={readOnly}
          onChange={(v) => {
            const occupants = [...(profile.occupants ?? [])];
            occupants[index].relationship = v;
            setProfile({ ...profile, occupants });
          }}
        />

      </div>
    ))}

  </Section>
)}

{step === 7 && (
  <Section title="Documents">

    {!readOnly && (
      <>
        <FileInput
          label="Upload Photo ID"
          onFile={(file) =>
            uploadFile(file, "photo_id")
          }
        />

        <FileInput
          label="Upload Pay Stub"
          onFile={(file) =>
            uploadFile(file, "pay_stub")
          }
        />

        <FileInput
          label="Upload Credit Report"
          onFile={(file) =>
            uploadFile(file, "credit_report")
          }
        />
      </>
    )}

    <div className="mt-4 space-y-2">
      {profile.documents?.map((doc, index) => (
        <div
          key={index}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>{doc.type}</span>

          {!readOnly && (
            <button
              onClick={() => removeDocument(index)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>

  </Section>
)}



      {step === 8 && (
        <Section title="Consent">
          <Checkbox
            label="I confirm accuracy"
            checked={profile.accuracyConfirmed}
            disabled={readOnly}
            onChange={(v) =>
              setProfile({
                ...profile,
                accuracyConfirmed: v,
              })
            }
          />

          <Checkbox
            label="I consent to credit check"
            checked={profile.creditCheckConsent}
            disabled={readOnly}
            onChange={(v) =>
              setProfile({
                ...profile,
                creditCheckConsent: v,
              })
            }
          />

          {!readOnly && (
            <button
              disabled={
                !profile.accuracyConfirmed ||
                !profile.creditCheckConsent
              }
              onClick={submitApplication}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
            >
              Submit Application
            </button>
          )}
        </Section>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() =>
            setStep((s) => Math.max(1, s - 1) as Step)
          }
          className="px-4 py-2 border"
        >
          Back
        </button>

        {!readOnly && (
          <button
            onClick={saveDraft}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Draft
          </button>
        )}

        <button
          onClick={() =>
            setStep((s) => Math.min(8, s + 1) as Step)
          }
          className="px-4 py-2 border"
        >
          Next
        </button>
      </div>

    </div>
  );
}

/* =========================================================
   UI HELPERS
========================================================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 border rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value?: string | number;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <input
      placeholder={label}
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-3 px-3 py-2 border rounded"
    />
  );
}

function Checkbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={checked ?? false}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex gap-2 mb-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded ${
            step >= i + 1
              ? "bg-blue-600"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function FileInput({
  label,
  onFile,
}: {
  label: string;
  onFile: (file: File) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}

