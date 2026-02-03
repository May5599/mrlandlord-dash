// "use client";

// import { api } from "@/convex/_generated/api";
// import { Doc, Id } from "@/convex/_generated/dataModel";

// import { useQuery, useMutation } from "convex/react";
// import { useState } from "react";
// import PropertiesNav from "../PropertiesNav";

// /* ---------------- TYPES ---------------- */

// type UnitFormData = {
//   propertyId: Id<"properties"> | "";
//   unitNumber: string;
//   type: string;
//   size: string;
//   floor: string;
//   baseRent: string;
//   status: "vacant" | "occupied" | "maintenance";
//   notes: string;
// };

// export default function AllUnitsPage() {
//   const units = useQuery(api.units.getAllUnits) ?? [];
//   const properties = useQuery(api.properties.getAllProperties) ?? [];
//   const tenants = useQuery(api.tenants.getAllTenants) ?? [];

//   // Mutations
//   const updateUnit = useMutation(api.units.updateUnit);
//   const deleteUnit = useMutation(api.units.deleteUnit);
//   const vacateUnit = useMutation(api.units.vacateUnit);
//   const createUnit = useMutation(api.units.createUnit);

//   // Filters
//   const [search, setSearch] = useState("");
//   const [filterProperty, setFilterProperty] = useState<Id<"properties"> | "all">("all");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const filteredUnits = units.filter((u) => {
//     const propertyName =
//       properties.find((p) => p._id === u.propertyId)?.name || "";

//     const matchesSearch =
//       u.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
//       propertyName.toLowerCase().includes(search.toLowerCase());

//     const matchesProperty =
//       filterProperty === "all" || u.propertyId === filterProperty;

//     const matchesStatus =
//       filterStatus === "all" || u.status === filterStatus;

//     return matchesSearch && matchesProperty && matchesStatus;
//   });

//   // Add modal
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newUnit, setNewUnit] = useState<UnitFormData>({
//     propertyId: "",
//     unitNumber: "",
//     type: "",
//     size: "",
//     floor: "",
//     baseRent: "",
//     status: "vacant",
//     notes: "",
//   });

//   const handleCreate = async () => {
//     if (!newUnit.propertyId) return alert("Select a property");

//     await createUnit({
//       propertyId: newUnit.propertyId as Id<"properties">,
//       unitNumber: newUnit.unitNumber,
//       type: newUnit.type,
//       size: newUnit.size,
//       floor: Number(newUnit.floor),
//       baseRent: Number(newUnit.baseRent),
//       status: newUnit.status,
//       notes: newUnit.notes,
//     });

//     setShowAddModal(false);
//     setNewUnit({
//       propertyId: "",
//       unitNumber: "",
//       type: "",
//       size: "",
//       floor: "",
//       baseRent: "",
//       status: "vacant",
//       notes: "",
//     });
//   };

//   // Edit modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editUnit, setEditUnit] = useState<UnitFormData | null>(null);
//   const [editUnitId, setEditUnitId] = useState<Id<"units"> | null>(null);

//   const openEdit = (u: Doc<"units">) => {
//   setEditUnitId(u._id);

//   setEditUnit({
//     propertyId: u.propertyId,
//     unitNumber: u.unitNumber,
//     type: u.type,
//     size: u.size ?? "", 
//     floor: u.floor != null ? String(u.floor) : "",
//     baseRent: String(u.baseRent),
//     status: (u.status as UnitFormData["status"]) ?? "vacant", 
//     notes: u.notes ?? "",
//   });

//   setShowEditModal(true);
// };


//   const handleUpdate = async () => {
//     if (!editUnit || !editUnitId) return;

//     await updateUnit({
//       id: editUnitId,
//       updates: {
//         unitNumber: editUnit.unitNumber,
//         type: editUnit.type,
//         size: editUnit.size,
//         floor: Number(editUnit.floor),
//         baseRent: Number(editUnit.baseRent),
//         status: editUnit.status,
//         notes: editUnit.notes,
//       },
//     });

//     setShowEditModal(false);
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-2">All Units</h1>
//       <p className="text-gray-500 mb-6">Manage and view all units.</p>

//       <PropertiesNav />

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-4 items-center">
//         <input
//           placeholder="Search unit or property..."
//           className="border p-2 rounded w-64"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="border p-2 rounded"
//           value={filterProperty}
//           onChange={(e) =>
//             setFilterProperty(
//               e.target.value === "all"
//                 ? "all"
//                 : (e.target.value as Id<"properties">)
//             )
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
//           onChange={(e) => setFilterStatus(e.target.value)}
//         >
//           <option value="all">Any Status</option>
//           <option value="occupied">Occupied</option>
//           <option value="vacant">Vacant</option>
//           <option value="maintenance">Maintenance</option>
//         </select>

//         <button
//           onClick={() => setShowAddModal(true)}
//           className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded"
//         >
//           + Add Unit
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white border rounded-xl shadow-sm">
//         <table className="w-full text-left">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               <th className="p-3">Unit</th>
//               <th className="p-3">Property</th>
//               <th className="p-3">Type</th>
//               <th className="p-3">Floor</th>
//               <th className="p-3">Rent</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Tenant</th>
//               <th className="p-3 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredUnits.map((u) => {
//               const property = properties.find((p) => p._id === u.propertyId);
//               const tenant = tenants.find((t) => t._id === u.currentTenantId);

//               return (
//                 <tr key={u._id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{u.unitNumber}</td>
//                   <td className="p-3">{property?.name}</td>
//                   <td className="p-3">{u.type}</td>
//                   <td className="p-3">{u.floor ?? "-"}</td>
//                   <td className="p-3">${u.baseRent}</td>

//                   <td className="p-3">
//                     <span
//                       className={`px-3 py-1 text-xs rounded-full ${
//                         u.status === "occupied"
//                           ? "bg-green-100 text-green-700"
//                           : u.status === "vacant"
//                           ? "bg-blue-100 text-blue-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {u.status}
//                     </span>
//                   </td>

//                   <td className="p-3">{tenant?.name ?? "—"}</td>

//                   <td className="p-3 text-right">
//                     <button
//                       onClick={() => openEdit(u)}
//                       className="text-indigo-600 mr-3"
//                     >
//                       Edit
//                     </button>

//                     {u.status === "occupied" && (
//                       <button
//                         onClick={() => vacateUnit({ unitId: u._id })}
//                         className="text-orange-600 mr-3"
//                       >
//                         Move Out
//                       </button>
//                     )}

//                     <button
//                       onClick={() => deleteUnit({ id: u._id })}
//                       className="text-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}

//             {filteredUnits.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="p-6 text-center text-gray-400">
//                   No units found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Modal */}
//       {showAddModal && (
//         <Modal title="Add New Unit" onClose={() => setShowAddModal(false)}>
//           <UnitForm
//             properties={properties}
//             data={newUnit}
//             setData={setNewUnit}
//             onSubmit={handleCreate}
//           />
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && editUnit && (
//         <Modal title="Edit Unit" onClose={() => setShowEditModal(false)}>
//           <UnitForm
//             properties={properties}
//             data={editUnit}
//             setData={setEditUnit}
//             onSubmit={handleUpdate}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ---------------- MODAL ---------------- */

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
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-xl w-[420px]">
//         <h2 className="text-xl font-semibold mb-4">{title}</h2>
//         {children}
//         <button className="mt-4 text-gray-600" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------------- FORM COMPONENT ---------------- */

// function UnitForm({
//   properties,
//   data,
//   setData,
//   onSubmit,
// }: {
//   properties: Doc<"properties">[];
//   data: UnitFormData;
//   setData: (v: UnitFormData) => void;
//   onSubmit: () => void;
// }) {
//   return (
//     <>
//       <select
//         className="w-full border p-2 rounded mb-3"
//         value={data.propertyId}
//         onChange={(e) =>
//           setData({ ...data, propertyId: e.target.value as Id<"properties"> })
//         }
//       >
//         <option value="">Select Property</option>
//         {properties.map((p) => (
//           <option key={p._id} value={p._id}>
//             {p.name}
//           </option>
//         ))}
//       </select>

//       <input
//         placeholder="Unit Number"
//         className="w-full border p-2 rounded mb-3"
//         value={data.unitNumber}
//         onChange={(e) => setData({ ...data, unitNumber: e.target.value })}
//       />

//       <input
//         placeholder="Type"
//         className="w-full border p-2 rounded mb-3"
//         value={data.type}
//         onChange={(e) => setData({ ...data, type: e.target.value })}
//       />

//       <input
//         placeholder="Size"
//         className="w-full border p-2 rounded mb-3"
//         value={data.size}
//         onChange={(e) => setData({ ...data, size: e.target.value })}
//       />

//       <input
//         placeholder="Floor"
//         className="w-full border p-2 rounded mb-3"
//         value={data.floor}
//         onChange={(e) => setData({ ...data, floor: e.target.value })}
//       />

//       <input
//         placeholder="Base Rent"
//         className="w-full border p-2 rounded mb-3"
//         value={data.baseRent}
//         onChange={(e) => setData({ ...data, baseRent: e.target.value })}
//       />

//       <select
//         className="w-full border p-2 rounded mb-3"
//         value={data.status}
//         onChange={(e) =>
//           setData({
//             ...data,
//             status: e.target.value as UnitFormData["status"],
//           })
//         }
//       >
//         <option value="vacant">Vacant</option>
//         <option value="occupied">Occupied</option>
//         <option value="maintenance">Maintenance</option>
//       </select>

//       <textarea
//         placeholder="Notes"
//         className="w-full border p-2 rounded mb-3"
//         value={data.notes}
//         onChange={(e) => setData({ ...data, notes: e.target.value })}
//       />

//       <button
//         onClick={onSubmit}
//         className="bg-indigo-600 text-white px-4 py-2 rounded w-full mt-2"
//       >
//         Save
//       </button>
//     </>
//   );
// }


"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import PropertiesNav from "../PropertiesNav";
import { useSessionToken } from "@/hooks/useSessionToken";  // ✅ ADD THIS

type UnitFormData = {
  propertyId: Id<"properties"> | "";
  unitNumber: string;
  type: string;
  size: string;
  floor: string;
  baseRent: string;
  status: "vacant" | "occupied" | "maintenance";
  notes: string;
};

export default function AllUnitsPage() {
  // ✅ ADD TOKEN AUTH
  const token = useSessionToken();
  const isReady = Boolean(token);

  // ✅ FIX QUERIES - Add token
  const units = useQuery(
    api.units.getAllUnits,
    token ? { token } : "skip"
  ) ?? [];

  const properties = useQuery(
    api.properties.getAllProperties,
    token ? { token } : "skip"
  ) ?? [];

  const tenants = useQuery(
    api.tenants.getAllTenants,
    token ? { token } : "skip"
  ) ?? [];

  // Mutations
  const updateUnit = useMutation(api.units.updateUnit);
  const deleteUnit = useMutation(api.units.deleteUnit);
  const vacateUnit = useMutation(api.units.vacateUnit);
  const createUnit = useMutation(api.units.createUnit);

  // Filters
  const [search, setSearch] = useState("");
  const [filterProperty, setFilterProperty] = useState<Id<"properties"> | "all">("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUnits = units.filter((u) => {
    const propertyName =
      properties.find((p) => p._id === u.propertyId)?.name || "";

    const matchesSearch =
      u.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      propertyName.toLowerCase().includes(search.toLowerCase());

    const matchesProperty =
      filterProperty === "all" || u.propertyId === filterProperty;

    const matchesStatus =
      filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesProperty && matchesStatus;
  });

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnit, setNewUnit] = useState<UnitFormData>({
    propertyId: "",
    unitNumber: "",
    type: "",
    size: "",
    floor: "",
    baseRent: "",
    status: "vacant",
    notes: "",
  });

  const handleCreate = async () => {
    if (!token) {  // ✅ ADD GUARD
      console.error("Token not ready");
      return;
    }

    if (!newUnit.propertyId) return alert("Select a property");

    await createUnit({
      token,  // ✅ ADD TOKEN
      propertyId: newUnit.propertyId as Id<"properties">,
      unitNumber: newUnit.unitNumber,
      type: newUnit.type,
      size: newUnit.size,
      floor: Number(newUnit.floor),
      baseRent: Number(newUnit.baseRent),
      status: newUnit.status,
      notes: newUnit.notes,
    });

    setShowAddModal(false);
    setNewUnit({
      propertyId: "",
      unitNumber: "",
      type: "",
      size: "",
      floor: "",
      baseRent: "",
      status: "vacant",
      notes: "",
    });
  };

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUnit, setEditUnit] = useState<UnitFormData | null>(null);
  const [editUnitId, setEditUnitId] = useState<Id<"units"> | null>(null);

  const openEdit = (u: Doc<"units">) => {
    setEditUnitId(u._id);

    setEditUnit({
      propertyId: u.propertyId,
      unitNumber: u.unitNumber,
      type: u.type,
      size: u.size ?? "",
      floor: u.floor != null ? String(u.floor) : "",
      baseRent: String(u.baseRent),
      status: (u.status as UnitFormData["status"]) ?? "vacant",
      notes: u.notes ?? "",
    });

    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!token || !editUnit || !editUnitId) return;  // ✅ ADD TOKEN GUARD

    await updateUnit({
      token,  // ✅ ADD TOKEN
      id: editUnitId,
      updates: {
        unitNumber: editUnit.unitNumber,
        type: editUnit.type,
        size: editUnit.size,
        floor: Number(editUnit.floor),
        baseRent: Number(editUnit.baseRent),
        status: editUnit.status,
        notes: editUnit.notes,
      },
    });

    setShowEditModal(false);
  };

  // ✅ ADD HANDLERS FOR DELETE AND VACATE
  const handleDelete = async (unitId: Id<"units">) => {
    if (!token) return;
    if (!confirm("Delete this unit?")) return;

    await deleteUnit({ token, id: unitId });
  };

  const handleVacate = async (unitId: Id<"units">) => {
    if (!token) return;
    if (!confirm("Mark this unit as vacant?")) return;

    await vacateUnit({ token, unitId });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">All Units</h1>
      <p className="text-gray-500 mb-6">Manage and view all units.</p>

      <PropertiesNav />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-4 items-center">
        <input
          placeholder="Search unit or property..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterProperty}
          onChange={(e) =>
            setFilterProperty(
              e.target.value === "all"
                ? "all"
                : (e.target.value as Id<"properties">)
            )
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
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Any Status</option>
          <option value="occupied">Occupied</option>
          <option value="vacant">Vacant</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={!isReady}  // ✅ ADD DISABLED STATE
          className={`ml-auto px-4 py-2 rounded ${
            isReady
              ? "bg-indigo-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          + Add Unit
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Unit</th>
              <th className="p-3">Property</th>
              <th className="p-3">Type</th>
              <th className="p-3">Floor</th>
              <th className="p-3">Rent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tenant</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUnits.map((u) => {
              const property = properties.find((p) => p._id === u.propertyId);
              const tenant = tenants.find((t) => t._id === u.currentTenantId);

              return (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.unitNumber}</td>
                  <td className="p-3">{property?.name}</td>
                  <td className="p-3">{u.type}</td>
                  <td className="p-3">{u.floor ?? "-"}</td>
                  <td className="p-3">${u.baseRent}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        u.status === "occupied"
                          ? "bg-green-100 text-green-700"
                          : u.status === "vacant"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3">{tenant?.name ?? "—"}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-indigo-600 mr-3"
                    >
                      Edit
                    </button>

                    {u.status === "occupied" && (
                      <button
                        onClick={() => handleVacate(u._id)}  // ✅ USE NEW HANDLER
                        className="text-orange-600 mr-3"
                      >
                        Move Out
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(u._id)}  // ✅ USE NEW HANDLER
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredUnits.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No units found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Unit" onClose={() => setShowAddModal(false)}>
          <UnitForm
            properties={properties}
            data={newUnit}
            setData={setNewUnit}
            onSubmit={handleCreate}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && editUnit && (
        <Modal title="Edit Unit" onClose={() => setShowEditModal(false)}>
          <UnitForm
            properties={properties}
            data={editUnit}
            setData={setEditUnit}
            onSubmit={handleUpdate}
          />
        </Modal>
      )}
    </div>
  );
}

/* Modal and Form components unchanged */
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[420px]">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button className="mt-4 text-gray-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function UnitForm({
  properties,
  data,
  setData,
  onSubmit,
}: {
  properties: Doc<"properties">[];
  data: UnitFormData;
  setData: (v: UnitFormData) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <select
        className="w-full border p-2 rounded mb-3"
        value={data.propertyId}
        onChange={(e) =>
          setData({ ...data, propertyId: e.target.value as Id<"properties"> })
        }
      >
        <option value="">Select Property</option>
        {properties.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Unit Number"
        className="w-full border p-2 rounded mb-3"
        value={data.unitNumber}
        onChange={(e) => setData({ ...data, unitNumber: e.target.value })}
      />

      <input
        placeholder="Type"
        className="w-full border p-2 rounded mb-3"
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
      />

      <input
        placeholder="Size"
        className="w-full border p-2 rounded mb-3"
        value={data.size}
        onChange={(e) => setData({ ...data, size: e.target.value })}
      />

      <input
        placeholder="Floor"
        className="w-full border p-2 rounded mb-3"
        value={data.floor}
        onChange={(e) => setData({ ...data, floor: e.target.value })}
      />

      <input
        placeholder="Base Rent"
        className="w-full border p-2 rounded mb-3"
        value={data.baseRent}
        onChange={(e) => setData({ ...data, baseRent: e.target.value })}
      />

      <select
        className="w-full border p-2 rounded mb-3"
        value={data.status}
        onChange={(e) =>
          setData({
            ...data,
            status: e.target.value as UnitFormData["status"],
          })
        }
      >
        <option value="vacant">Vacant</option>
        <option value="occupied">Occupied</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <textarea
        placeholder="Notes"
        className="w-full border p-2 rounded mb-3"
        value={data.notes}
        onChange={(e) => setData({ ...data, notes: e.target.value })}
      />

      <button
        onClick={onSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full mt-2"
      >
        Save
      </button>
    </>
  );
}