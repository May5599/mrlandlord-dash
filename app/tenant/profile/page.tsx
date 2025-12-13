// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { api } from "@/convex/_generated/api";
// import { fetchMutation, fetchQuery } from "convex/nextjs";

// const steps = [
//   "Personal Info",
//   "Employment",
//   "Occupants",
//   "Vehicle",
//   "Pets",
//   "Emergency Contact",
// ];

// export default function TenantProfile() {
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState<any>({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     dob: "",
//     phone: "",
//     employmentStatus: "",
//     employerName: "",
//     jobTitle: "",
//     monthlyIncome: "",
//     occupants: [],
//     vehicle: { model: "", plate: "" },
//     pets: [],
//     emergencyContact: { name: "", phone: "", relationship: "" },
//   });

//   // Fetch tenant session first
//   const [tenantId, setTenantId] = useState<string | null>(null);

//   useEffect(() => {
//     async function start() {
//       const res = await fetch("/api/tenant/get-session");
//       const session = await res.json();

//       if (!session.valid) {
//         window.location.href = "/tenant/login";
//         return;
//       }

//       setTenantId(session.tenantId);

//       // Check if profile already exists
//       const existing = await fetchQuery(api.tenantProfiles.getProfile, {
//         tenantId: session.tenantId,
//       });

//       if (existing) {
//         setForm(existing);
//       }

//       setLoading(false);
//     }

//     start();
//   }, []);

//   function updateField(path: string, value: any) {
//     setForm((prev: any) => {
//       const copy = { ...prev };
//       const keys = path.split(".");
//       let obj = copy;

//       while (keys.length > 1) {
//         const k = keys.shift()!;
//         obj = obj[k];
//       }

//       obj[keys[0]] = value;
//       return copy;
//     });
//   }

//   async function submitProfile() {
//     if (!tenantId) return;

//     await fetchMutation(api.tenantProfiles.createProfile, {
//       tenantId,
//       ...form,
//     });

//     alert("Profile completed successfully!");
//     window.location.href = "/tenant/dashboard";
//   }

//   const slide = {
//     hidden: { x: 100, opacity: 0 },
//     visible: { x: 0, opacity: 1 },
//     exit: { x: -100, opacity: 0 },
//   };

//   if (loading) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="max-w-xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-semibold text-center mb-6">Tenant Profile</h1>

//       {/* Step Indicators */}
//       <div className="flex justify-center mb-6 gap-2">
//         {steps.map((_, i) => (
//           <div
//             key={i}
//             className={`w-3 h-3 rounded-full ${
//               i === current ? "bg-blue-600" : "bg-gray-300"
//             }`}
//           />
//         ))}
//       </div>

//       {/* Card */}
//       <div className="bg-white shadow-md border rounded-xl p-6 min-h-[300px]">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={current}
//             variants={slide}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             transition={{ duration: 0.35 }}
//           >
//             {current === 0 && (
//               <div className="space-y-4">
//                 <input
//                   className="input"
//                   placeholder="First Name"
//                   value={form.firstName}
//                   onChange={(e) => updateField("firstName", e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   placeholder="Middle Name"
//                   value={form.middleName}
//                   onChange={(e) => updateField("middleName", e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   placeholder="Last Name"
//                   value={form.lastName}
//                   onChange={(e) => updateField("lastName", e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   placeholder="Date of Birth"
//                   value={form.dob}
//                   onChange={(e) => updateField("dob", e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   placeholder="Phone Number"
//                   value={form.phone}
//                   onChange={(e) => updateField("phone", e.target.value)}
//                 />
//               </div>
//             )}

//             {current === 1 && (
//               <div className="space-y-4">
//                 <input
//                   className="input"
//                   placeholder="Employment Status"
//                   value={form.employmentStatus}
//                   onChange={(e) =>
//                     updateField("employmentStatus", e.target.value)
//                   }
//                 />
//                 <input
//                   className="input"
//                   placeholder="Employer Name"
//                   value={form.employerName}
//                   onChange={(e) =>
//                     updateField("employerName", e.target.value)
//                   }
//                 />
//                 <input
//                   className="input"
//                   placeholder="Job Title"
//                   value={form.jobTitle}
//                   onChange={(e) => updateField("jobTitle", e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   placeholder="Monthly Income"
//                   value={form.monthlyIncome}
//                   onChange={(e) =>
//                     updateField("monthlyIncome", Number(e.target.value))
//                   }
//                 />
//               </div>
//             )}

//             {current === 2 && (
//               <div className="space-y-4">
//                 <button
//                   className="px-4 py-2 bg-blue-100 text-blue-800 rounded"
//                   onClick={() =>
//                     updateField("occupants", [
//                       ...form.occupants,
//                       { fullName: "", phone: "", relationship: "" },
//                     ])
//                   }
//                 >
//                   Add Occupant
//                 </button>

//                 {form.occupants.map((occ: any, idx: number) => (
//                   <div key={idx} className="p-3 border rounded-lg space-y-2">
//                     <input
//                       className="input"
//                       placeholder="Full Name"
//                       value={occ.fullName}
//                       onChange={(e) => {
//                         const arr = [...form.occupants];
//                         arr[idx].fullName = e.target.value;
//                         updateField("occupants", arr);
//                       }}
//                     />
//                     <input
//                       className="input"
//                       placeholder="Phone"
//                       value={occ.phone}
//                       onChange={(e) => {
//                         const arr = [...form.occupants];
//                         arr[idx].phone = e.target.value;
//                         updateField("occupants", arr);
//                       }}
//                     />
//                     <input
//                       className="input"
//                       placeholder="Relationship"
//                       value={occ.relationship}
//                       onChange={(e) => {
//                         const arr = [...form.occupants];
//                         arr[idx].relationship = e.target.value;
//                         updateField("occupants", arr);
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {current === 3 && (
//               <div className="space-y-4">
//                 <input
//                   className="input"
//                   placeholder="Vehicle Model"
//                   value={form.vehicle?.model}
//                   onChange={(e) => updateField("vehicle.model", e.target.value)}
//                 />
//                 <input
//                   className="input"
//                   placeholder="License Plate"
//                   value={form.vehicle?.plate}
//                   onChange={(e) => updateField("vehicle.plate", e.target.value)}
//                 />
//               </div>
//             )}

//             {current === 4 && (
//               <div className="space-y-4">
//                 <button
//                   className="px-4 py-2 bg-blue-100 text-blue-800 rounded"
//                   onClick={() =>
//                     updateField("pets", [...form.pets, { type: "", size: "" }])
//                   }
//                 >
//                   Add Pet
//                 </button>

//                 {form.pets.map((pet: any, idx: number) => (
//                   <div key={idx} className="p-3 border rounded-lg space-y-2">
//                     <input
//                       className="input"
//                       placeholder="Type"
//                       value={pet.type}
//                       onChange={(e) => {
//                         const arr = [...form.pets];
//                         arr[idx].type = e.target.value;
//                         updateField("pets", arr);
//                       }}
//                     />
//                     <input
//                       className="input"
//                       placeholder="Size"
//                       value={pet.size}
//                       onChange={(e) => {
//                         const arr = [...form.pets];
//                         arr[idx].size = e.target.value;
//                         updateField("pets", arr);
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {current === 5 && (
//               <div className="space-y-4">
//                 <input
//                   className="input"
//                   placeholder="Emergency Contact Name"
//                   value={form.emergencyContact.name}
//                   onChange={(e) =>
//                     updateField("emergencyContact.name", e.target.value)
//                   }
//                 />
//                 <input
//                   className="input"
//                   placeholder="Phone"
//                   value={form.emergencyContact.phone}
//                   onChange={(e) =>
//                     updateField("emergencyContact.phone", e.target.value)
//                   }
//                 />
//                 <input
//                   className="input"
//                   placeholder="Relationship"
//                   value={form.emergencyContact.relationship}
//                   onChange={(e) =>
//                     updateField("emergencyContact.relationship", e.target.value)
//                   }
//                 />
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between mt-6">
//         {current > 0 ? (
//           <button
//             className="btn-secondary"
//             onClick={() => setCurrent((c) => c - 1)}
//           >
//             Back
//           </button>
//         ) : (
//           <div />
//         )}

//         {current < steps.length - 1 ? (
//           <button
//             className="btn-primary"
//             onClick={() => setCurrent((c) => c + 1)}
//           >
//             Next
//           </button>
//         ) : (
//           <button className="btn-primary" onClick={submitProfile}>
//             Finish
//           </button>
//         )}
//       </div>

//       <style jsx>{`
//         .input {
//           width: 100%;
//           border: 1px solid #d1d5db;
//           padding: 10px;
//           border-radius: 6px;
//         }
//         .btn-primary {
//           background: #2563eb;
//           color: white;
//           padding: 10px 18px;
//           border-radius: 6px;
//         }
//         .btn-secondary {
//           background: #e5e7eb;
//           padding: 10px 18px;
//           border-radius: 6px;
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";

type Occupant = {
  fullName: string;
  phone?: string;
  relationship?: string;
};

type Pet = {
  type: string;
  size: string;
};

export default function TenantProfile() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [openSection, setOpenSection] = useState<string>("personal");

  // Profile form state
  const [form, setForm] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    phone: "",
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    monthlyIncome: "",
    occupants: [] as Occupant[],
    vehicle: { model: "", plate: "" },
    pets: [] as Pet[],
    emergencyContact: { name: "", phone: "", relationship: "" },
  });

  // Fetch session + profile on load
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        method: "GET",
        credentials: "include",
      });

      const session = await res.json();
      if (!session.valid) {
        window.location.href = "/tenant/login";
        return;
      }

      setTenantId(session.tenantId);

      const existingProfile = await fetchQuery(
        api.tenantProfiles.getProfile,
        { tenantId: session.tenantId }
      );

      if (existingProfile) {
        setProfile(existingProfile);
        setForm(existingProfile);
      }
    }

    load();
  }, []);

  function toggle(section: string) {
    setOpenSection(prev => (prev === section ? "" : section));
  }

  async function saveSection() {
  if (!tenantId) return;

  // Remove Convex system fields
  const cleaned = {
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

  if (!profile) {
    // CREATE NEW PROFILE
    await fetchMutation(api.tenantProfiles.createProfile, {
      tenantId,
      ...cleaned,
    });
  } else {
    // UPDATE EXISTING PROFILE
    await fetchMutation(api.tenantProfiles.updateProfile, {
      profileId: profile._id,
      data: cleaned,
    });
  }

  alert("Profile saved successfully!");
}


  if (!tenantId) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-28 h-28 bg-gray-200 rounded-full mb-3 border flex items-center justify-center text-gray-500">
          Photo
        </div>
        <h2 className="text-2xl font-semibold">
          {form.firstName || "Your"} {form.lastName || "Profile"}
        </h2>
        <p className="text-gray-600 text-sm">(Editable Profile)</p>
      </div>

      {/* Accordion Wrapper */}
      <div className="space-y-4">

        {/* PERSONAL INFO */}
        <Accordion
          title="Personal Information"
          open={openSection === "personal"}
          onClick={() => toggle("personal")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              className="input"
              placeholder="First Name"
              value={form.firstName || ""}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <input
              className="input"
              placeholder="Middle Name"
              value={form.middleName || ""}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
            />

            <input
              className="input"
              placeholder="Last Name"
              value={form.lastName || ""}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />

            <input
              type="date"
              className="input"
              value={form.dob || ""}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />

            <input
              className="input"
              placeholder="Phone Number"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

          </div>

          <SaveButton onClick={saveSection} />
        </Accordion>

        {/* EMPLOYMENT */}
        <Accordion
          title="Employment & Income"
          open={openSection === "employment"}
          onClick={() => toggle("employment")}
        >
          <select
            className="input"
            value={form.employmentStatus || ""}
            onChange={(e) =>
              setForm({ ...form, employmentStatus: e.target.value })
            }
          >
            <option value="">Employment Status</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="self-employed">Self Employed</option>
            <option value="student">Student</option>
            <option value="unemployed">Unemployed</option>
          </select>

          <input
            className="input"
            placeholder="Employer Name"
            value={form.employerName || ""}
            onChange={(e) =>
              setForm({ ...form, employerName: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Job Title"
            value={form.jobTitle || ""}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          />

          <input
            className="input"
            placeholder="Monthly Income"
            value={form.monthlyIncome || ""}
            onChange={(e) =>
              setForm({ ...form, monthlyIncome: Number(e.target.value) })
            }
          />

          <SaveButton onClick={saveSection} />
        </Accordion>

        {/* OCCUPANTS */}
        <Accordion
          title="Other Occupants"
          open={openSection === "occupants"}
          onClick={() => toggle("occupants")}
        >
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() =>
              setForm({
                ...form,
                occupants: [...form.occupants, { fullName: "", relationship: "" }],
              })
            }
          >
            + Add Occupant
          </button>

          {form.occupants.map((occ: Occupant, idx: number) => (
            <div key={idx} className="mt-4 p-3 border rounded bg-gray-50">

              <input
                className="input mb-2"
                placeholder="Full Name"
                value={occ.fullName}
                onChange={(e) => {
                  const list = [...form.occupants];
                  list[idx].fullName = e.target.value;
                  setForm({ ...form, occupants: list });
                }}
              />

              <input
                className="input mb-2"
                placeholder="Phone Number"
                value={occ.phone || ""}
                onChange={(e) => {
                  const list = [...form.occupants];
                  list[idx].phone = e.target.value;
                  setForm({ ...form, occupants: list });
                }}
              />

              <input
                className="input mb-2"
                placeholder="Relationship"
                value={occ.relationship || ""}
                onChange={(e) => {
                  const list = [...form.occupants];
                  list[idx].relationship = e.target.value;
                  setForm({ ...form, occupants: list });
                }}
              />

              <button
                className="text-red-600 text-sm"
                onClick={() => {
                  const list = [...form.occupants];
                  list.splice(idx, 1);
                  setForm({ ...form, occupants: list });
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <SaveButton onClick={saveSection} />
        </Accordion>

        {/* VEHICLE */}
        <Accordion
          title="Vehicle Information"
          open={openSection === "vehicle"}
          onClick={() => toggle("vehicle")}
        >
          <input
            className="input"
            placeholder="Vehicle Model"
            value={form.vehicle?.model || ""}
            onChange={(e) =>
              setForm({ ...form, vehicle: { ...form.vehicle, model: e.target.value } })
            }
          />

          <input
            className="input"
            placeholder="License Plate"
            value={form.vehicle?.plate || ""}
            onChange={(e) =>
              setForm({ ...form, vehicle: { ...form.vehicle, plate: e.target.value } })
            }
          />

          <SaveButton onClick={saveSection} />
        </Accordion>

        {/* PETS */}
        <Accordion
          title="Pets"
          open={openSection === "pets"}
          onClick={() => toggle("pets")}
        >
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() =>
              setForm({
                ...form,
                pets: [...form.pets, { type: "", size: "" }],
              })
            }
          >
            + Add Pet
          </button>

          {form.pets.map((pet: Pet, idx: number) => (
            <div key={idx} className="mt-4 p-3 border rounded bg-gray-50">

              <input
                className="input mb-2"
                placeholder="Pet Type"
                value={pet.type}
                onChange={(e) => {
                  const list = [...form.pets];
                  list[idx].type = e.target.value;
                  setForm({ ...form, pets: list });
                }}
              />

              <input
                className="input mb-2"
                placeholder="Pet Size"
                value={pet.size}
                onChange={(e) => {
                  const list = [...form.pets];
                  list[idx].size = e.target.value;
                  setForm({ ...form, pets: list });
                }}
              />

              <button
                className="text-red-600 text-sm"
                onClick={() => {
                  const list = [...form.pets];
                  list.splice(idx, 1);
                  setForm({ ...form, pets: list });
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <SaveButton onClick={saveSection} />
        </Accordion>

        {/* EMERGENCY CONTACT */}
        <Accordion
          title="Emergency Contact"
          open={openSection === "emergency"}
          onClick={() => toggle("emergency")}
        >
          <input
            className="input"
            placeholder="Full Name"
            value={form.emergencyContact?.name || ""}
            onChange={(e) =>
              setForm({
                ...form,
                emergencyContact: { ...form.emergencyContact, name: e.target.value },
              })
            }
          />

          <input
            className="input"
            placeholder="Phone Number"
            value={form.emergencyContact?.phone || ""}
            onChange={(e) =>
              setForm({
                ...form,
                emergencyContact: { ...form.emergencyContact, phone: e.target.value },
              })
            }
          />

          <input
            className="input"
            placeholder="Relationship"
            value={form.emergencyContact?.relationship || ""}
            onChange={(e) =>
              setForm({
                ...form,
                emergencyContact: { ...form.emergencyContact, relationship: e.target.value },
              })
            }
          />

          <SaveButton onClick={saveSection} />
        </Accordion>

      </div>
    </div>
  );
}

/* ---------------------- COMPONENTS ---------------------- */

function Accordion({
  title,
  open,
  onClick,
  children,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
  children: any;
}) {
  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <button
        onClick={onClick}
        className="w-full flex justify-between p-4 text-left font-semibold"
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Save
    </button>
  );
}

/* Tailwind input class */
const inputStyle = `
input {
  @apply w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200;
}
`;
