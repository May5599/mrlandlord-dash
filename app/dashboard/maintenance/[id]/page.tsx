
// "use client";

// import { useParams } from "next/navigation";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import MaintenanceNav from "../MaintenanceNav";
// import { useState, useEffect } from "react";

// export default function MaintenanceDetailsPage() {
//   const { id } = useParams();

//   const request = useQuery(api.maintenance.getMaintenanceById, {
//   id: id as any,
// });

//   const vendors = useQuery(api.vendors.getVendors) ?? [];

//   const updateRequest = useMutation(api.maintenance.updateMaintenance);
//   const deleteRequest = useMutation(api.maintenance.deleteRequest);
//   const assignVendor = useMutation(api.maintenance.assignVendor);
//   const logHours = useMutation(api.maintenance.logHours);

//   const [updating, setUpdating] = useState(false);
//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [hours, setHours] = useState("");
//   const [hoursNote, setHoursNote] = useState("");
//   const [showHoursModal, setShowHoursModal] = useState(false);

//   // Preselect assigned vendor
//   useEffect(() => {
//     if (request?.assignedVendorId) {
//       setSelectedVendor(request.assignedVendorId);
//     }
//   }, [request]);

//   // if (!request) return <p className="p-8">Loading...</p>;

//   if (request === undefined) {
//   return <p className="p-8">Loading...</p>;
// }

// // Convex null → request does not exist
// if (request === null) {
//   return <p className="p-8 text-red-500">Request not found</p>;
// }
//   /* ---------------------------------------------------
//         HANDLERS
//   --------------------------------------------------- */

//   // async function handleStatusChange(e: any) {
//   //   const value = e.target.value;
//   //   setUpdating(true);

//   //   await updateRequest({
//   //     id: request._id,
//   //     updates: { status: value },
//   //   });

//   //   setUpdating(false);
//   // }

//   async function handleStatusChange(e: any) {
//   if (!request) return; // safety

//   const value = e.target.value;
//   setUpdating(true);

//   await updateRequest({
//     id: request._id,
//     updates: { status: value },
//   });

//   setUpdating(false);
// }

//   async function handleSeverityChange(e: any) {
//     const value = e.target.value;
//     setUpdating(true);

//     await updateRequest({
//       id: request._id,
//       updates: { severity: value, priority: value },
//     });

//     setUpdating(false);
//   }

//   async function handleCostChange(e: any) {
//     await updateRequest({
//       id: request._id,
//       updates: { cost: Number(e.target.value) },
//     });
//   }

//   async function handleAssignVendor() {
//     if (!selectedVendor) {
//       alert("Please select a vendor");
//       return;
//     }

//     await assignVendor({
//       id: request._id,
//       vendorId: selectedVendor,
//     });

//     alert("Vendor assigned successfully");
//   }

//   async function handleAddHours() {
//     if (!hours) {
//       alert("Hours required");
//       return;
//     }

//     if (!request.assignedVendorId) {
//       alert("No vendor assigned to this request");
//       return;
//     }

//     await logHours({
//       id: request._id,
//       vendorId: request.assignedVendorId,
//       hours: Number(hours),
//       note: hoursNote,
//     });

//     setHours("");
//     setHoursNote("");
//     setShowHoursModal(false);
//   }

//   async function handleDelete() {
//     if (!confirm("Delete this maintenance request?")) return;

//     await deleteRequest({ id: request._id });
//     window.location.href = "/dashboard/maintenance/all";
//   }

//   /* ---------------------------------------------------
//         UI RENDER
//   --------------------------------------------------- */

//   const assignedVendorName =
//     vendors.find((v) => v._id === request.assignedVendorId)?.name ||
//     "Not assigned";

//   const assignedDate = request.assignedAt
//     ? new Date(request.assignedAt).toLocaleString()
//     : null;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-2">Request Details</h1>
//       <p className="text-gray-600 mb-6">Full maintenance request view.</p>

//       <MaintenanceNav />

//       <div className="mt-6 bg-white border rounded-xl shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-start">
//           <h2 className="text-xl font-semibold">{request.title}</h2>

//           <span
//             className={`px-3 py-1 rounded-full text-xs ${
//               request.status === "open"
//                 ? "bg-orange-100 text-orange-700"
//                 : request.status === "in-progress"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-green-100 text-green-700"
//             }`}
//           >
//             {request.status}
//           </span>
//         </div>

//         <p className="text-gray-700 mt-3">{request.description}</p>

//         {/* DETAILS */}
//         <div className="grid grid-cols-3 gap-6 mt-6">
//           <Detail label="Category" value={request.category} />
//           <Detail label="Severity" value={request.severity} />
//           <Detail label="Location" value={request.location} />
//           <Detail label="Allow Entry" value={request.allowEntry ? "Yes" : "No"} />
//           <Detail
//             label="Access Preference"
//             value={request.accessPreference || "Not provided"}
//           />
//           <Detail
//             label="Created"
//             value={new Date(request.createdAt).toLocaleDateString()}
//           />
//         </div>

//         {/* IMAGES */}
//         {request.images?.length > 0 && (
//           <>
//             <h3 className="mt-6 font-semibold">Attached Photos</h3>
//             <div className="grid grid-cols-3 gap-4 mt-3">
//               {request.images.map((img: string, idx: number) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   className="w-full h-40 object-cover rounded border"
//                 />
//               ))}
//             </div>
//           </>
//         )}

//         {/* ASSIGN VENDOR */}
//         <h3 className="mt-10 font-semibold text-lg">Assign Vendor</h3>

//         <div className="flex gap-4 mt-3 items-center">
//           <select
//             className="border p-2 rounded w-64"
//             value={selectedVendor}
//             onChange={(e) => setSelectedVendor(e.target.value)}
//           >
//             <option value="">Select vendor</option>
//             {vendors.map((v) => (
//               <option key={v._id} value={v._id}>
//                 {v.name} ({v.specialty})
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={handleAssignVendor}
//             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//           >
//             Assign
//           </button>
//         </div>

//         {request.assignedVendorId && (
//           <div className="mt-3 text-gray-700 text-sm">
//             Assigned to: <strong>{assignedVendorName}</strong>
//             {assignedDate && (
//               <p className="text-gray-500 text-xs mt-1">
//                 Assigned At: {assignedDate}
//               </p>
//             )}
//           </div>
//         )}

//         {/* HOURS LOG */}
//         <h3 className="mt-10 font-semibold text-lg">Work Hours Log</h3>

//         <button
//           onClick={() => setShowHoursModal(true)}
//           className="mt-2 mb-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//         >
//           Add Hours
//         </button>

//         {request.hoursLog?.length > 0 ? (
//           <div className="space-y-3">
//             {request.hoursLog.map((entry: any, idx: number) => (
//               <div key={idx} className="bg-gray-50 border p-3 rounded-xl text-sm">
//                 <p>
//                   <strong>Hours:</strong> {entry.hours}
//                 </p>
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {new Date(entry.date).toLocaleDateString()}
//                 </p>
//                 {entry.note && (
//                   <p>
//                     <strong>Note:</strong> {entry.note}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-sm">No hours logged yet.</p>
//         )}

//         {/* HOURS MODAL */}
//         {showHoursModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//             <div className="bg-white p-6 w-96 rounded-xl shadow-xl">
//               <h3 className="text-lg font-semibold mb-3">Add Hours</h3>

//               <input
//                 type="number"
//                 className="border p-2 rounded w-full mb-3"
//                 placeholder="Hours worked"
//                 value={hours}
//                 onChange={(e) => setHours(e.target.value)}
//               />

//               <textarea
//                 className="border p-2 rounded w-full h-20 mb-3"
//                 placeholder="Optional note"
//                 value={hoursNote}
//                 onChange={(e) => setHoursNote(e.target.value)}
//               />

//               <div className="flex gap-4 justify-end">
//                 <button
//                   onClick={() => setShowHoursModal(false)}
//                   className="text-gray-600 px-3 py-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddHours}
//                   className="bg-indigo-600 text-white px-4 py-1 rounded"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MANAGER CONTROLS */}
//         <h3 className="mt-10 font-semibold text-lg">Manager Controls</h3>

//         <div className="grid grid-cols-3 gap-6 mt-4">
//           {/* Status */}
//           <div>
//             <label className="block text-sm mb-1">Update Status</label>
//             <select
//               className="border p-2 rounded w-full"
//               value={request.status}
//               onChange={handleStatusChange}
//             >
//               <option value="open">Open</option>
//               <option value="in-progress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           {/* Severity */}
//           <div>
//             <label className="block text-sm mb-1">Update Severity</label>
//             <select
//               className="border p-2 rounded w-full"
//               value={request.severity}
//               onChange={handleSeverityChange}
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//               <option value="emergency">Emergency</option>
//             </select>
//           </div>

//           {/* Cost */}
//           <div>
//             <label className="block text-sm mb-1">Repair Cost ($)</label>
//             <input
//               type="number"
//               className="border p-2 rounded w-full"
//               value={request.cost || ""}
//               onChange={handleCostChange}
//               placeholder="0.00"
//             />
//           </div>
//         </div>

//         {/* DELETE BUTTON */}
//         <button
//           onClick={handleDelete}
//           className="mt-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           Delete Request
//         </button>

//         {updating && <p className="text-sm text-gray-500 mt-2">Updating...</p>}
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------
//       DETAIL COMPONENT
// --------------------------------------------------- */
// function Detail({ label, value }: { label: string; value: any }) {
//   return (
//     <div className="p-4 border rounded-xl bg-gray-50">
//       <p className="text-gray-500 text-sm">{label}</p>
//       <p className="font-medium mt-1">{value}</p>
//     </div>
//   );
// }

"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../MaintenanceNav";
import { useState, useEffect } from "react";

export default function MaintenanceDetailsPage() {
  const { id } = useParams();

  const request = useQuery(api.maintenance.getMaintenanceById, {
    id: id as any,
  });

  const vendors = useQuery(api.vendors.getVendors) ?? [];

  const updateRequest = useMutation(api.maintenance.updateMaintenance);
  const deleteRequest = useMutation(api.maintenance.deleteRequest);
  const assignVendor = useMutation(api.maintenance.assignVendor);
  const logHours = useMutation(api.maintenance.logHours);

  const [updating, setUpdating] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [hours, setHours] = useState("");
  const [hoursNote, setHoursNote] = useState("");
  const [showHoursModal, setShowHoursModal] = useState(false);

  // Preselect vendor
  useEffect(() => {
    if (request?.assignedVendorId) {
      setSelectedVendor(request.assignedVendorId);
    }
  }, [request]);

  // Convex → request undefined while loading
  if (request === undefined) {
    return <p className="p-8">Loading...</p>;
  }

  // Convex → null means not found
  if (request === null) {
    return <p className="p-8 text-red-500">Request not found</p>;
  }

  /* ---------------------------------------------------
        HANDLERS  (All include null-safety)
  --------------------------------------------------- */

  async function handleStatusChange(e: any) {
    if (!request) return;
    const value = e.target.value;

    setUpdating(true);
    await updateRequest({
      id: request._id,
      updates: { status: value },
    });
    setUpdating(false);
  }

  async function handleSeverityChange(e: any) {
    if (!request) return;
    const value = e.target.value;

    await updateRequest({
      id: request._id,
      updates: { severity: value, priority: value },
    });
  }

  async function handleCostChange(e: any) {
    if (!request) return;

    await updateRequest({
      id: request._id,
      updates: { cost: Number(e.target.value) },
    });
  }

  async function handleAssignVendor() {
  if (!request) return;

  if (!selectedVendor) {
    alert("Please select a vendor");
    return;
  }

  await assignVendor({
    id: request._id,
    vendorId: selectedVendor as any,   // <-- FIX
  });

  alert("Vendor assigned successfully");
}


  async function handleAddHours() {
    if (!request) return;

    if (!hours) {
      alert("Hours required");
      return;
    }

    if (!request.assignedVendorId) {
      alert("No vendor assigned to this request");
      return;
    }

    await logHours({
      id: request._id,
      vendorId: request.assignedVendorId,
      hours: Number(hours),
      note: hoursNote,
    });

    setHours("");
    setHoursNote("");
    setShowHoursModal(false);
  }

  async function handleDelete() {
    if (!request) return;

    if (!confirm("Delete this maintenance request?")) return;

    await deleteRequest({ id: request._id });
    window.location.href = "/dashboard/maintenance/all";
  }

  /* ---------------------------------------------------
        UI RENDER
  --------------------------------------------------- */

  const assignedVendorName =
    vendors.find((v) => v._id === request.assignedVendorId)?.name ||
    "Not assigned";

  const assignedDate = request.assignedAt
    ? new Date(request.assignedAt).toLocaleString()
    : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Request Details</h1>
      <p className="text-gray-600 mb-6">Full maintenance request view.</p>

      <MaintenanceNav />

      <div className="mt-6 bg-white border rounded-xl shadow-sm p-6">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{request.title}</h2>

          <span
            className={`px-3 py-1 rounded-full text-xs ${
              request.status === "open"
                ? "bg-orange-100 text-orange-700"
                : request.status === "in-progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {request.status}
          </span>
        </div>

        <p className="text-gray-700 mt-3">{request.description}</p>

        {/* DETAILS */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <Detail label="Category" value={request.category} />
          <Detail label="Severity" value={request.severity} />
          <Detail label="Location" value={request.location} />
          <Detail label="Allow Entry" value={request.allowEntry ? "Yes" : "No"} />
          <Detail
            label="Access Preference"
            value={request.accessPreference || "Not provided"}
          />
          <Detail
            label="Created"
            value={new Date(request.createdAt).toLocaleDateString()}
          />
        </div>

        {/* IMAGES */}
        {request.images?.length > 0 && (
          <>
            <h3 className="mt-6 font-semibold">Attached Photos</h3>
            <div className="grid grid-cols-3 gap-4 mt-3">
              {request.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  className="w-full h-40 object-cover rounded border"
                />
              ))}
            </div>
          </>
        )}

        {/* ASSIGN VENDOR */}
        <h3 className="mt-10 font-semibold text-lg">Assign Vendor</h3>

        <div className="flex gap-4 mt-3 items-center">
          <select
            className="border p-2 rounded w-64"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="">Select vendor</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} ({v.specialty})
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignVendor}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Assign
          </button>
        </div>

        {request.assignedVendorId && (
          <div className="mt-3 text-gray-700 text-sm">
            Assigned to: <strong>{assignedVendorName}</strong>
            {assignedDate && (
              <p className="text-gray-500 text-xs mt-1">
                Assigned At: {assignedDate}
              </p>
            )}
          </div>
        )}

        {/* HOURS LOG */}
        <h3 className="mt-10 font-semibold text-lg">Work Hours Log</h3>

        <button
          onClick={() => setShowHoursModal(true)}
          className="mt-2 mb-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add Hours
        </button>

        {request.hoursLog?.length > 0 ? (
          <div className="space-y-3">
            {request.hoursLog.map((entry: any, idx: number) => (
              <div key={idx} className="bg-gray-50 border p-3 rounded-xl text-sm">
                <p>
                  <strong>Hours:</strong> {entry.hours}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                {entry.note && (
                  <p>
                    <strong>Note:</strong> {entry.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hours logged yet.</p>
        )}

        {/* HOURS MODAL */}
        {showHoursModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 w-96 rounded-xl shadow-xl">
              <h3 className="text-lg font-semibold mb-3">Add Hours</h3>

              <input
                type="number"
                className="border p-2 rounded w-full mb-3"
                placeholder="Hours worked"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />

              <textarea
                className="border p-2 rounded w-full h-20 mb-3"
                placeholder="Optional note"
                value={hoursNote}
                onChange={(e) => setHoursNote(e.target.value)}
              />

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowHoursModal(false)}
                  className="text-gray-600 px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHours}
                  className="bg-indigo-600 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MANAGER CONTROLS */}
        <h3 className="mt-10 font-semibold text-lg">Manager Controls</h3>

        <div className="grid grid-cols-3 gap-6 mt-4">
          {/* Status */}
          <div>
            <label className="block text-sm mb-1">Update Status</label>
            <select
              className="border p-2 rounded w-full"
              value={request.status}
              onChange={handleStatusChange}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm mb-1">Update Severity</label>
            <select
              className="border p-2 rounded w-full"
              value={request.severity}
              onChange={handleSeverityChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm mb-1">Repair Cost ($)</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={request.cost || ""}
              onChange={handleCostChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          className="mt-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Request
        </button>

        {updating && <p className="text-sm text-gray-500 mt-2">Updating...</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
      DETAIL COMPONENT
--------------------------------------------------- */
function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}
