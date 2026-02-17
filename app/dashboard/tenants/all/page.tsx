// "use client";

// import { api } from "@/convex/_generated/api";
// import { Doc, Id } from "@/convex/_generated/dataModel";
// import { useQuery, useMutation } from "convex/react";
// import { useEffect, useState } from "react";
// import TenantsNav from "../../tenants/TenantsNav";

// /* ----------------------------------------------------------
//    TYPES
// ----------------------------------------------------------- */
// type TenantStatus = "active" | "vacated" | "pending";

// type TenantFormData = {
//   name: string;
//   phone: string;
//   email: string;
//   leaseStart: string;
//   leaseEnd: string;
//   rentAmount: string;
//   deposit: string;
//   propertyId: Id<"properties"> | "";
//   unitId: Id<"units"> | "";
//   status: TenantStatus;
// };

// /* ----------------------------------------------------------
//    PAGE
// ----------------------------------------------------------- */
// export default function AllTenantsPage() {
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     setToken(localStorage.getItem("sessionToken"));
//   }, []);

//   const tenants =
//     useQuery(
//       api.tenants.getTenants,
//       token ? { token } : "skip"
//     ) ?? [];

//   const units =
//     useQuery(
//       api.units.getAllUnits,
//       token ? { token } : "skip"
//     ) ?? [];

//   const properties =
//     useQuery(
//       api.properties.getAllProperties,
//       token ? { token } : "skip"
//     ) ?? [];

//   const updateTenant = useMutation(api.tenants.updateTenant);
//   const deleteTenant = useMutation(api.tenants.deleteTenant);
//   const moveOutTenant = useMutation(api.tenants.moveOutTenant);

//   /* ----------------------------------------------------------
//      FILTERS
//   ----------------------------------------------------------- */
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState<"all" | TenantStatus>("all");
//   const [filterProperty, setFilterProperty] = useState<"all" | Id<"properties">>("all");

//   const filteredTenants = tenants.filter((t) => {
//     const unit = units.find((u) => u._id === t.unitId);
//     const property = properties.find((p) => p._id === t.propertyId);

//     const matchesSearch =
//       t.name.toLowerCase().includes(search.toLowerCase()) ||
//       t.email.toLowerCase().includes(search.toLowerCase()) ||
//       property?.name.toLowerCase().includes(search.toLowerCase()) ||
//       unit?.unitNumber.toLowerCase().includes(search.toLowerCase());

//     const matchesStatus =
//       filterStatus === "all" || t.status === filterStatus;

//     const matchesProperty =
//       filterProperty === "all" || t.propertyId === filterProperty;

//     return matchesSearch && matchesStatus && matchesProperty;
//   });

//   /* ----------------------------------------------------------
//      EDIT
//   ----------------------------------------------------------- */
//   const [showEdit, setShowEdit] = useState(false);
//   const [editTenant, setEditTenant] = useState<
//     (TenantFormData & { _id: Id<"tenants"> }) | null
//   >(null);

//   const openEdit = (t: Doc<"tenants">) => {
//     setEditTenant({
//       _id: t._id,
//       name: t.name,
//       phone: t.phone,
//       email: t.email,
//       leaseStart: t.leaseStart,
//       leaseEnd: t.leaseEnd ?? "",
//       rentAmount: String(t.rentAmount),
//       deposit: String(t.deposit),
//       propertyId: t.propertyId,
//       unitId: t.unitId,
//       status: t.status as TenantStatus,
//     });
//     setShowEdit(true);
//   };

//   const handleUpdate = async () => {
//     if (!editTenant || !token) return;

//     await updateTenant({
//       token,
//       tenantId: editTenant._id,
//       updates: {
//         name: editTenant.name,
//         phone: editTenant.phone,
//         email: editTenant.email,
//         leaseStart: editTenant.leaseStart,
//         leaseEnd: editTenant.leaseEnd,
//         rentAmount: Number(editTenant.rentAmount),
//         deposit: Number(editTenant.deposit),
//         status: editTenant.status,
//       },
//     });

//     setShowEdit(false);
//   };

//   /* ----------------------------------------------------------
//      DELETE
//   ----------------------------------------------------------- */
//   const handleDelete = async (id: Id<"tenants">) => {
//     if (!token || !confirm("Delete this tenant?")) return;
//     await deleteTenant({ token, tenantId: id });
//   };

//   /* ----------------------------------------------------------
//      MOVE OUT
//   ----------------------------------------------------------- */
//   const handleMoveOut = async (t: Doc<"tenants">) => {
//     if (!token || !confirm("Mark tenant as moved out?")) return;

//     await moveOutTenant({
//       token,
//       tenantId: t._id,
//       unitId: t.unitId,
//     });
//   };

//   /* ----------------------------------------------------------
//      UI
//   ----------------------------------------------------------- */
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-2">All Tenants</h1>
//       <p className="text-gray-500 mb-6">
//         Manage tenant records across all properties.
//       </p>

//       <TenantsNav />

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-xl border mb-6 flex gap-4">
//         <input
//           placeholder="Search tenant, property, or unit..."
//           className="border p-2 rounded w-64"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="border p-2 rounded"
//           value={filterProperty}
//           onChange={(e) =>
//             setFilterProperty(e.target.value as any)
//           }
//         >
//           <option value="all">All Properties</option>
//           {properties.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         <select
//           className="border p-2 rounded"
//           value={filterStatus}
//           onChange={(e) =>
//             setFilterStatus(e.target.value as any)
//           }
//         >
//           <option value="all">Any Status</option>
//           <option value="active">Active</option>
//           <option value="pending">Pending</option>
//           <option value="vacated">Vacated</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white border rounded-xl overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-3">Tenant</th>
//               <th className="p-3">Property</th>
//               <th className="p-3">Unit</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Status</th>
//               <th className="p-3 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredTenants.map((t) => {
//               const unit = units.find((u) => u._id === t.unitId);
//               const property = properties.find((p) => p._id === t.propertyId);

//               return (
//                 <tr key={t._id} className="border-b">
//                   <td className="p-3 font-medium">
//                     <a
//                       href={`/dashboard/tenants/${t._id}`}
//                       className="text-indigo-600 hover:underline"
//                     >
//                       {t.name}
//                     </a>
//                   </td>
//                   <td className="p-3">{property?.name ?? " "}</td>
//                   <td className="p-3">{unit?.unitNumber ?? " "}</td>
//                   <td className="p-3">{t.phone}</td>
//                   <td className="p-3">{t.email}</td>
//                   <td className="p-3">{t.status}</td>
//                   <td className="p-3 text-right">
//                     <button onClick={() => openEdit(t)} className="mr-4 text-indigo-600">
//                       Edit
//                     </button>
//                     {t.status === "active" && (
//                       <button onClick={() => handleMoveOut(t)} className="mr-4 text-orange-600">
//                         Move Out
//                       </button>
//                     )}
//                     <button onClick={() => handleDelete(t._id)} className="text-red-600">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}

//             {filteredTenants.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="p-6 text-center text-gray-400">
//                   No tenants found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showEdit && editTenant && (
//         <EditModal
//           data={editTenant}
//           setData={setEditTenant}
//           onClose={() => setShowEdit(false)}
//           onSave={handleUpdate}
//         />
//       )}
//     </div>
//   );
// }

// /* ----------------------------------------------------------
//    EDIT MODAL
// ----------------------------------------------------------- */
// function EditModal({
//   data,
//   setData,
//   onClose,
//   onSave,
// }: {
//   data: TenantFormData & { _id: Id<"tenants"> };
//   setData: any;
//   onClose: () => void;
//   onSave: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl w-[420px]">
//         <h2 className="text-lg font-semibold mb-4">Edit Tenant</h2>

//         <input
//           className="w-full border p-2 rounded mb-3"
//           value={data.name}
//           onChange={(e) => setData({ ...data, name: e.target.value })}
//         />

//         <input
//           className="w-full border p-2 rounded mb-3"
//           value={data.phone}
//           onChange={(e) => setData({ ...data, phone: e.target.value })}
//         />

//         <input
//           className="w-full border p-2 rounded mb-3"
//           value={data.email}
//           onChange={(e) => setData({ ...data, email: e.target.value })}
//         />

//         <button
//           onClick={onSave}
//           className="w-full bg-indigo-600 text-white p-2 rounded"
//         >
//           Save
//         </button>

//         <button onClick={onClose} className="w-full mt-2 text-gray-500">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { useSessionToken } from "@/hooks/useSessionToken";
import TenantsNav from "../../tenants/TenantsNav";

/* ----------------------------------------------------------
   TYPES
----------------------------------------------------------- */
type TenantStatus = "active" | "vacated" | "pending";

type TenantFormData = {
  name: string;
  phone: string;
  email: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: string;
  deposit: string;
  propertyId: Id<"properties"> | "";
  unitId: Id<"units"> | "";
  status: TenantStatus;
};

/* ----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default function AllTenantsPage() {
  const token = useSessionToken();
  const isReady = !!token;

 const tenants =
  useQuery(
    api.tenants.getAllTenants,
    isReady ? { token } : "skip"
  ) ?? [];


  const units =
    useQuery(
      api.units.getAllUnits,
      isReady ? { token } : "skip"
    ) ?? [];

  const properties =
    useQuery(
      api.properties.getAllProperties,
      isReady ? { token } : "skip"
    ) ?? [];

  const updateTenant = useMutation(api.tenants.updateTenant);
  const deleteTenant = useMutation(api.tenants.deleteTenant);
  const moveOutTenant = useMutation(api.tenants.moveOutTenant);

  /* ----------------------------------------------------------
     FILTERS
  ----------------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | TenantStatus>("all");
  const [filterProperty, setFilterProperty] =
    useState<"all" | Id<"properties">>("all");

  const filteredTenants = tenants.filter((t) => {
    const unit = units.find((u) => u._id === t.unitId);
    const property = properties.find((p) => p._id === t.propertyId);

    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      property?.name.toLowerCase().includes(search.toLowerCase()) ||
      unit?.unitNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || t.status === filterStatus;

    const matchesProperty =
      filterProperty === "all" || t.propertyId === filterProperty;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  /* ----------------------------------------------------------
     EDIT
  ----------------------------------------------------------- */
  const [showEdit, setShowEdit] = useState(false);
  const [editTenant, setEditTenant] = useState<
    (TenantFormData & { _id: Id<"tenants"> }) | null
  >(null);

  const openEdit = (t: Doc<"tenants">) => {
    setEditTenant({
      _id: t._id,
      name: t.name,
      phone: t.phone,
      email: t.email,
      leaseStart: t.leaseStart,
      leaseEnd: t.leaseEnd ?? "",
      rentAmount: String(t.rentAmount),
      deposit: String(t.deposit),
      propertyId: t.propertyId,
      unitId: t.unitId,
      status: t.status as TenantStatus,
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editTenant || !token) return;

    await updateTenant({
      token,
      tenantId: editTenant._id,
      updates: {
        name: editTenant.name,
        phone: editTenant.phone,
        email: editTenant.email,
        leaseStart: editTenant.leaseStart,
        leaseEnd: editTenant.leaseEnd,
        rentAmount: Number(editTenant.rentAmount),
        deposit: Number(editTenant.deposit),
        status: editTenant.status,
      },
    });

    setShowEdit(false);
  };

  /* ----------------------------------------------------------
     DELETE
  ----------------------------------------------------------- */
  const handleDelete = async (id: Id<"tenants">) => {
    if (!token || !confirm("Delete this tenant?")) return;
    await deleteTenant({ token, tenantId: id });
  };

  /* ----------------------------------------------------------
     MOVE OUT
  ----------------------------------------------------------- */
  const handleMoveOut = async (t: Doc<"tenants">) => {
    if (!token || !confirm("Mark tenant as moved out?")) return;

    await moveOutTenant({
      token,
      tenantId: t._id,
      unitId: t.unitId,
    });
  };

  /* ----------------------------------------------------------
     UI
  ----------------------------------------------------------- */
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">All Tenants</h1>
      <p className="text-gray-500 mb-6">
        Manage tenant records across all properties.
      </p>

      <TenantsNav />

      <div className="bg-white p-4 rounded-xl border mb-6 flex gap-4">
        <input
          placeholder="Search tenant, property, or unit..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterProperty}
          onChange={(e) =>
            setFilterProperty(e.target.value as any)
          }
        >
          <option value="all">All Properties</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as any)
          }
        >
          <option value="all">Any Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="vacated">Vacated</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Tenant</th>
              <th className="p-3">Property</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTenants.map((t) => {
              const unit = units.find((u) => u._id === t.unitId);
              const property = properties.find((p) => p._id === t.propertyId);

              return (
                <tr key={t._id} className="border-b">
                  <td className="p-3 font-medium">
                    <a
                      href={`/dashboard/tenants/${t._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {t.name}
                    </a>
                  </td>
                  <td className="p-3">{property?.name ?? " "}</td>
                  <td className="p-3">{unit?.unitNumber ?? " "}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(t)}
                      className="mr-4 text-indigo-600"
                    >
                      Edit
                    </button>
                    {t.status === "active" && (
                      <button
                        onClick={() => handleMoveOut(t)}
                        className="mr-4 text-orange-600"
                      >
                        Move Out
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEdit && editTenant && (
        <EditModal
          data={editTenant}
          setData={setEditTenant}
          onClose={() => setShowEdit(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------
   EDIT MODAL
----------------------------------------------------------- */
function EditModal({
  data,
  setData,
  onClose,
  onSave,
}: {
  data: TenantFormData & { _id: Id<"tenants"> };
  setData: React.Dispatch<
    React.SetStateAction<
      (TenantFormData & { _id: Id<"tenants"> }) | null
    >
  >;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[420px]">
        <h2 className="text-lg font-semibold mb-4">Edit Tenant</h2>

        <input
          className="w-full border p-2 rounded mb-3"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <button
          onClick={onSave}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
