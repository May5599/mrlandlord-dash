// "use client";

// import { useState } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import MaintenanceNav from "../maintenance/MaintenanceNav";
// import Link from "next/link";
// import { useSessionToken } from "@/hooks/useSessionToken";

// export default function VendorsPage() {
//   /* ----------------------------------------------------------
//      AUTH (CUSTOM SESSION TOKEN)
//   ----------------------------------------------------------- */
//   const token = useSessionToken();
//   const isReady = !!token;

//   /* ----------------------------------------------------------
//      QUERIES (COMPANY-SCOPED)
//   ----------------------------------------------------------- */
// const vendors =
//   useQuery(
//     api.vendors.getVendors,
//     isReady ? { token } : "skip"
//   ) ?? [];


//   /* ----------------------------------------------------------
//      MUTATIONS
//   ----------------------------------------------------------- */
//   const addVendor = useMutation(api.vendors.addVendor);
//   const removeVendor = useMutation(api.vendors.deleteVendor);

//   /* ----------------------------------------------------------
//      STATE
//   ----------------------------------------------------------- */
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     specialty: "",
//   });

//   /* ----------------------------------------------------------
//      HANDLERS
//   ----------------------------------------------------------- */
//   const handleAdd = async () => {
//     if (!isReady) return;

//     if (!form.name || !form.phone) {
//       alert("Name and phone are required");
//       return;
//     }

//     await addVendor({
//   token,
//   name: form.name,
//   phone: form.phone,
//   email: form.email || undefined,
//   specialty: form.specialty || undefined,
//   createdAt: new Date().toISOString(),
// });


//     setForm({
//       name: "",
//       phone: "",
//       email: "",
//       specialty: "",
//     });
//   };

//   const handleDelete = async (vendorId: string) => {
//     if (!isReady) return;
//     if (!confirm("Delete this vendor?")) return;

//     await removeVendor({
//   token,
//   id: vendorId,
// });

//   };

//   /* ----------------------------------------------------------
//      UI
//   ----------------------------------------------------------- */
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-2">
//         Vendors & Contractors
//       </h1>
//       <p className="text-gray-600 mb-6">
//         Add trusted vendors for plumbing, electrical, HVAC,
//         cleaning, and general repairs.
//       </p>

//       <MaintenanceNav />

//       {/* ADD VENDOR */}
//       <div className="bg-white p-6 rounded-xl border shadow-sm max-w-xl mt-6">
//         <h2 className="font-semibold mb-4 text-lg">
//           Add New Vendor
//         </h2>

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Vendor Name"
//           value={form.name}
//           onChange={(e) =>
//             setForm({ ...form, name: e.target.value })
//           }
//         />

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Phone"
//           value={form.phone}
//           onChange={(e) =>
//             setForm({ ...form, phone: e.target.value })
//           }
//         />

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Email (optional)"
//           value={form.email}
//           onChange={(e) =>
//             setForm({ ...form, email: e.target.value })
//           }
//         />

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Specialty (Plumber, Electrician, HVAC, etc)"
//           value={form.specialty}
//           onChange={(e) =>
//             setForm({ ...form, specialty: e.target.value })
//           }
//         />

//         <button
//           className="w-full bg-indigo-600 text-white p-2 rounded disabled:opacity-50"
//           onClick={handleAdd}
//           disabled={!isReady}
//         >
//           Add Vendor
//         </button>
//       </div>

//       {/* VENDORS LIST */}
//       <div className="mt-8 bg-white border rounded-xl shadow-sm p-6">
//         <h2 className="font-semibold mb-4 text-lg">
//           All Vendors
//         </h2>

//         {!isReady ? (
//           <p className="text-gray-500">Loading…</p>
//         ) : vendors.length === 0 ? (
//           <p className="text-gray-500">
//             No vendors added yet.
//           </p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-left p-2">Name</th>
//                 <th className="text-left p-2">Phone</th>
//                 <th className="text-left p-2">Specialty</th>
//                 <th className="text-left p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {vendors.map((v) => (
//                 <tr
//                   key={v._id}
//                   className="border-b hover:bg-gray-50"
//                 >
//                   <td className="p-2">{v.name}</td>
//                   <td className="p-2">{v.phone}</td>
//                   <td className="p-2">
//                     {v.specialty || "—"}
//                   </td>
//                   <td className="p-2 flex gap-4">
//                     <Link
//                       href={`/dashboard/vendors/${v._id}`}
//                       className="text-indigo-600 hover:underline"
//                     >
//                       View Dashboard
//                     </Link>

//                     <button
//                       onClick={() => handleDelete(v._id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../maintenance/MaintenanceNav";
import Link from "next/link";
import { useSessionToken } from "@/hooks/useSessionToken";

export default function VendorsPage() {
  const token = useSessionToken();
  const isReady = !!token;

  const vendors =
    useQuery(
      api.vendors.getVendors,
      isReady ? { token } : "skip"
    ) ?? [];

  const addVendor = useMutation(api.vendors.addVendor);
  const deleteVendor = useMutation(api.vendors.deleteVendor);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    specialty: "",
  });

  const handleAdd = async () => {
    if (!isReady) return;

    if (!form.name || !form.phone) {
      alert("Name and phone are required");
      return;
    }

    await addVendor({
      token,
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      specialty: form.specialty || undefined,
      createdAt: new Date().toISOString(),
    });

    setForm({ name: "", phone: "", email: "", specialty: "" });
  };

  const handleDelete = async (id: string) => {
    if (!isReady) return;
    if (!confirm("Delete this vendor?")) return;

    await deleteVendor({ token, id });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Vendors & Contractors</h1>
      <p className="text-gray-600 mb-6">
        Company-specific vendors only.
      </p>

      <MaintenanceNav />

      {/* ADD VENDOR */}
      <div className="bg-white p-6 rounded-xl border max-w-xl mt-6">
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Vendor Name"
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
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Specialty"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
        />

        <button
          onClick={handleAdd}
          disabled={!isReady}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Add Vendor
        </button>
      </div>

      {/* LIST */}
      <div className="mt-8 bg-white border rounded-xl p-6">
        {vendors.length === 0 ? (
          <p className="text-gray-500">No vendors yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-b">
                  <td className="p-2">{v.name}</td>
                  <td className="p-2">{v.phone}</td>
                  <td className="p-2">{v.specialty || "—"}</td>
                  <td className="p-2 flex gap-4">
                    <Link
                      href={`/dashboard/vendors/${v._id}`}
                      className="text-indigo-600"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
