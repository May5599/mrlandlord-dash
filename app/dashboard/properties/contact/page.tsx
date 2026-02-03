

// "use client";

// import { useSessionToken } from "@/hooks/useSessionToken";

// import { useState } from "react";
// import PropertiesNav from "../PropertiesNav";
// import { api } from "@/convex/_generated/api";
// import { Doc, Id } from "@/convex/_generated/dataModel";
// import { useQuery, useMutation } from "convex/react";

// /* -------------------- TYPES -------------------- */

// type ContactType = "tenant" | "vendor" | "contractor" | "emergency";

// type ContactFormData = {
//   type: ContactType;
//   name: string;
//   phone: string;
//   email: string;
//   propertyId: string;
//   unitId: string;
//   notes: string;
// };

// export default function ContactsPage() {
//   const [tab, setTab] = useState<ContactType>("tenant");
// const token = useSessionToken();
// const isReady = !!token;

//   /* -------------------- QUERIES -------------------- */
//   // IMPORTANT: useQuery ALWAYS takes (fn, args)
//   // If no args, pass {}
//   const contacts =
//     useQuery(api.contacts.getContactsByType, { token, type: tab })


// const properties =
//   useQuery(
//     api.properties.getAllProperties,
//     isReady ? { token } : "skip"
//   ) ?? [];

// const units =
//   useQuery(
//     api.units.getAllUnits,
//     isReady ? { token } : "skip"
//   ) ?? [];


//   /* -------------------- MUTATIONS -------------------- */

//   const createContact = useMutation(api.contacts.createContact);
//   const updateContact = useMutation(api.contacts.updateContact);
//   const deleteContact = useMutation(api.contacts.deleteContact);

//   /* -------------------- STATE -------------------- */

//   const [showModal, setShowModal] = useState(false);
//   const [edit, setEdit] = useState<Doc<"contacts"> | null>(null);

//   const emptyForm: ContactFormData = {
//     type: tab,
//     name: "",
//     phone: "",
//     email: "",
//     propertyId: "",
//     unitId: "",
//     notes: "",
//   };

//   const [form, setForm] = useState<ContactFormData>(emptyForm);

//   /* -------------------- HANDLERS -------------------- */

//   const openAdd = () => {
//     setForm({ ...emptyForm, type: tab });
//     setEdit(null);
//     setShowModal(true);
//   };

//   const openEdit = (c: Doc<"contacts">) => {
//     setEdit(c);
//     setForm({
//       type: c.type as ContactType,
//       name: c.name,
//       phone: c.phone,
//       email: c.email,
//       propertyId: c.propertyId ?? "",
//       unitId: c.unitId ?? "",
//       notes: c.notes ?? "",
//     });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (edit) {
//       await updateContact({
//         id: edit._id,
//         updates: {
//           name: form.name,
//           phone: form.phone,
//           email: form.email,
//           notes: form.notes,
//         },
//       });
//     } else {
//       await createContact({
//         type: form.type,
//         name: form.name,
//         phone: form.phone,
//         email: form.email,
//         notes: form.notes,
//         propertyId: form.propertyId
//           ? (form.propertyId as Id<"properties">)
//           : undefined,
//         unitId: form.unitId
//           ? (form.unitId as Id<"units">)
//           : undefined,
//       });
//     }

//     setShowModal(false);
//   };

//   /* -------------------- UI -------------------- */

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold">Contacts</h1>
//       <p className="text-gray-500 mb-6">
//         Manage tenants, vendors, contractors, and emergency contacts.
//       </p>

//       <PropertiesNav />

//       {/* Tabs */}
//       <div className="flex gap-4 border-b mb-6">
//         {["tenant", "vendor", "contractor", "emergency"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t as ContactType)}
//             className={`pb-2 px-2 ${
//               tab === t
//                 ? "border-b-2 border-indigo-600 text-indigo-600"
//                 : "text-gray-500"
//             }`}
//           >
//             {t.charAt(0).toUpperCase() + t.slice(1)}
//           </button>
//         ))}
//       </div>

//       <button
//         onClick={openAdd}
//         className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
//       >
//         + Add {tab}
//       </button>

//       {/* Table */}
//       <div className="bg-white border rounded-xl shadow-sm">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-3">Name</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Email</th>
//               {tab === "tenant" && <th className="p-3">Property</th>}
//               {tab === "tenant" && <th className="p-3">Unit</th>}
//               <th className="p-3">Notes</th>
//               <th className="p-3 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {contacts.map((c) => {
//               const property = properties.find((p) => p._id === c.propertyId);
//               const unit = units.find((u) => u._id === c.unitId);

//               return (
//                 <tr key={c._id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{c.name}</td>
//                   <td className="p-3">{c.phone}</td>
//                   <td className="p-3">{c.email}</td>
//                   {tab === "tenant" && (
//                     <td className="p-3">{property?.name ?? "—"}</td>
//                   )}
//                   {tab === "tenant" && (
//                     <td className="p-3">{unit?.unitNumber ?? "—"}</td>
//                   )}
//                   <td className="p-3">{c.notes}</td>
//                   <td className="p-3 text-right">
//                     <button
//                       onClick={() => openEdit(c)}
//                       className="text-indigo-600 mr-3"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteContact({ id: c._id })}
//                       className="text-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}

//             {contacts.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="text-center p-6 text-gray-400">
//                   No contacts found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <Modal title={`Add ${tab}`} onClose={() => setShowModal(false)}>
//           <ContactForm
//             form={form}
//             setForm={setForm}
//             properties={properties}
//             units={units}
//             showPropertyFields={tab === "tenant"}
//             onSubmit={handleSave}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* -------------------- MODAL -------------------- */

// function Modal({
//   title,
//   children,
//   onClose,
// }: {
//   title: string;
//   children: React.ReactNode;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">
//         <h2 className="text-xl font-semibold mb-4">{title}</h2>
//         {children}
//         <button onClick={onClose} className="mt-4 text-gray-600">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// /* -------------------- FORM -------------------- */

// function ContactForm({
//   form,
//   setForm,
//   properties,
//   units,
//   showPropertyFields,
//   onSubmit,
// }: {
//   form: ContactFormData;
//   setForm: (v: ContactFormData) => void;
//   properties: Doc<"properties">[];
//   units: Doc<"units">[];
//   showPropertyFields: boolean;
//   onSubmit: () => void;
// }) {
//   return (
//     <>
//       <input
//         className="w-full border p-2 rounded mb-3"
//         placeholder="Name"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//       />

//       <input
//         className="w-full border p-2 rounded mb-3"
//         placeholder="Phone"
//         value={form.phone}
//         onChange={(e) => setForm({ ...form, phone: e.target.value })}
//       />

//       <input
//         className="w-full border p-2 rounded mb-3"
//         placeholder="Email"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       />

//       {showPropertyFields && (
//         <>
//           <select
//             className="w-full border p-2 rounded mb-3"
//             value={form.propertyId}
//             onChange={(e) =>
//               setForm({ ...form, propertyId: e.target.value })
//             }
//           >
//             <option value="">Select Property</option>
//             {properties.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>

//           <select
//             className="w-full border p-2 rounded mb-3"
//             value={form.unitId}
//             onChange={(e) => setForm({ ...form, unitId: e.target.value })}
//           >
//             <option value="">Select Unit</option>
//             {units.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.unitNumber}
//               </option>
//             ))}
//           </select>
//         </>
//       )}

//       <textarea
//         className="w-full border p-2 rounded mb-3"
//         placeholder="Notes"
//         value={form.notes}
//         onChange={(e) => setForm({ ...form, notes: e.target.value })}
//       />

//       <button
//         onClick={onSubmit}
//         className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
//       >
//         Save
//       </button>
//     </>
//   );
// }


"use client";

import { useSessionToken } from "@/hooks/useSessionToken";
import { useState } from "react";
import PropertiesNav from "../PropertiesNav";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";

/* -------------------- TYPES -------------------- */

type ContactType = "tenant" | "vendor" | "contractor" | "emergency";

type ContactFormData = {
  type: ContactType;
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  unitId: string;
  notes: string;
};

export default function ContactsPage() {
  const [tab, setTab] = useState<ContactType>("tenant");

  const token = useSessionToken();
  const isReady = !!token;

  /* -------------------- QUERIES -------------------- */

  const contacts =
    useQuery(
      api.contacts.getContactsByType,
      isReady ? { token, type: tab } : "skip"
    ) ?? [];

  const properties =
    useQuery(
      api.properties.getAllProperties,
      isReady ? { token } : "skip"
    ) ?? [];

  const units =
    useQuery(
      api.units.getAllUnits,
      isReady ? { token } : "skip"
    ) ?? [];

  /* -------------------- MUTATIONS -------------------- */

  const createContact = useMutation(api.contacts.createContact);
  const updateContact = useMutation(api.contacts.updateContact);
  const deleteContact = useMutation(api.contacts.deleteContact);

  /* -------------------- STATE -------------------- */

  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState<Doc<"contacts"> | null>(null);

  const emptyForm: ContactFormData = {
    type: tab,
    name: "",
    phone: "",
    email: "",
    propertyId: "",
    unitId: "",
    notes: "",
  };

  const [form, setForm] = useState<ContactFormData>(emptyForm);

  /* -------------------- HANDLERS -------------------- */

  const openAdd = () => {
    setForm({ ...emptyForm, type: tab });
    setEdit(null);
    setShowModal(true);
  };

  const openEdit = (c: Doc<"contacts">) => {
    setEdit(c);
    setForm({
      type: c.type as ContactType,
      name: c.name,
      phone: c.phone,
      email: c.email,
      propertyId: c.propertyId ?? "",
      unitId: c.unitId ?? "",
      notes: c.notes ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!isReady) return;

    if (edit) {
      await updateContact({
        token,
        id: edit._id,
        updates: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
        },
      });
    } else {
      await createContact({
        token,
        type: form.type,
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
        propertyId: form.propertyId
          ? (form.propertyId as Id<"properties">)
          : undefined,
        unitId: form.unitId
          ? (form.unitId as Id<"units">)
          : undefined,
      });
    }

    setShowModal(false);
  };

  const handleDelete = async (id: Id<"contacts">) => {
    if (!isReady) return;
    if (!confirm("Delete this contact?")) return;

    await deleteContact({ token, id });
  };

  /* -------------------- UI -------------------- */

  if (!isReady) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Contacts</h1>
      <p className="text-gray-500 mb-6">
        Manage tenants, vendors, contractors, and emergency contacts.
      </p>

      <PropertiesNav />

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {["tenant", "vendor", "contractor", "emergency"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as ContactType)}
            className={`pb-2 px-2 ${
              tab === t
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <button
        onClick={openAdd}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add {tab}
      </button>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              {tab === "tenant" && <th className="p-3">Property</th>}
              {tab === "tenant" && <th className="p-3">Unit</th>}
              <th className="p-3">Notes</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => {
              const property = properties.find((p) => p._id === c.propertyId);
              const unit = units.find((u) => u._id === c.unitId);

              return (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.email}</td>
                  {tab === "tenant" && (
                    <td className="p-3">{property?.name ?? "—"}</td>
                  )}
                  {tab === "tenant" && (
                    <td className="p-3">{unit?.unitNumber ?? "—"}</td>
                  )}
                  <td className="p-3">{c.notes}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-indigo-600 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {contacts.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-400">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={`Add ${tab}`} onClose={() => setShowModal(false)}>
          <ContactForm
            form={form}
            setForm={setForm}
            properties={properties}
            units={units}
            showPropertyFields={tab === "tenant"}
            onSubmit={handleSave}
          />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- MODAL -------------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 text-gray-600">
          Close
        </button>
      </div>
    </div>
  );
}

/* -------------------- FORM -------------------- */

function ContactForm({
  form,
  setForm,
  properties,
  units,
  showPropertyFields,
  onSubmit,
}: {
  form: ContactFormData;
  setForm: (v: ContactFormData) => void;
  properties: Doc<"properties">[];
  units: Doc<"units">[];
  showPropertyFields: boolean;
  onSubmit: () => void;
}) {
  return (
    <>
      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {showPropertyFields && (
        <>
          <select
            className="w-full border p-2 rounded mb-3"
            value={form.propertyId}
            onChange={(e) =>
              setForm({ ...form, propertyId: e.target.value })
            }
          >
            <option value="">Select Property</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-2 rounded mb-3"
            value={form.unitId}
            onChange={(e) => setForm({ ...form, unitId: e.target.value })}
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.unitNumber}
              </option>
            ))}
          </select>
        </>
      )}

      <textarea
        className="w-full border p-2 rounded mb-3"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button
        onClick={onSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
      >
        Save
      </button>
    </>
  );
}
