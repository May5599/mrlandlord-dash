

"use client";

import MaintenanceImage from "@/components/MaintenanceImage";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../MaintenanceNav";
import { useState, useEffect } from "react";
import { useSessionToken } from "@/hooks/useSessionToken";
import { Id } from "@/convex/_generated/dataModel";

export default function MaintenanceDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  /* ---------------- AUTH ---------------- */
  const token = useSessionToken();
  const isReady = !!token;

  /* ---------------- QUERIES ---------------- */
  const request =
    useQuery(
      api.maintenance.getMaintenanceById,
      isReady && id ? { token, id: id as Id<"maintenance"> } : "skip"
    ) ?? null;

  const vendors =
    useQuery(
      api.vendors.getVendors,
      isReady ? { token } : "skip"
    ) ?? [];

  /* ---------------- MUTATIONS ---------------- */
  const updateRequest = useMutation(api.maintenance.updateMaintenance);
  const deleteRequest = useMutation(api.maintenance.deleteRequest);
  const assignVendor = useMutation(api.maintenance.assignVendor);
  const logHours = useMutation(api.maintenance.logHours);
  const scheduleMaintenance = useMutation(api.maintenance.scheduleMaintenance);

  /* ---------------- STATE ---------------- */
  const [updating, setUpdating] = useState(false);
  // const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<Id<"vendors"> | undefined>(undefined);

  const [hours, setHours] = useState<string>("");
  const [hoursNote, setHoursNote] = useState<string>("");
  const [showHoursModal, setShowHoursModal] = useState(false);

  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledFrom, setScheduledFrom] = useState<string>("");
  const [scheduledTo, setScheduledTo] = useState<string>("");
  const [status, setStatus] = useState<string>("");


  /* ---------------- EFFECT ---------------- */
// useEffect(() => {
//   if (!request) return;

//   if (request.assignedVendorId) {
//     setSelectedVendor(request.assignedVendorId);
//   }

//   if (request.scheduledDate) {
//     setScheduledDate(request.scheduledDate);
//     setScheduledFrom(request.scheduledTimeFrom ?? "");
//     setScheduledTo(request.scheduledTimeTo ?? "");
//   }

//   setStatus(request.status);

// }, [request]);
useEffect(() => {
  if (!request) return;

  setSelectedVendor(request.assignedVendorId ?? undefined);
  setScheduledDate(request.scheduledDate ?? "");
  setScheduledFrom(request.scheduledTimeFrom ?? "");
  setScheduledTo(request.scheduledTimeTo ?? "");

  // IMPORTANT: only set status if it hasn't been set yet
  setStatus((prev) => prev || request.status);

}, [request]);



  /* ---------------- LOADING ---------------- */
  if (!isReady) {
  return <p className="p-8">Loading…</p>;
}

if (!request) {
  return (
    <p className="p-8 text-red-500">
      Maintenance request not found
    </p>
  );
}

  const maintenance = request;


  const authToken = token as string;

  /* ---------------- HANDLERS ---------------- */

  // async function handleStatusChange(
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) {
  //   setUpdating(true);

  //   await updateRequest({
  //     token: authToken,
  //     id: maintenance._id,
  //     updates: { status: e.target.value },
  //   });

  //   setUpdating(false);
  // }

  async function handleAssignVendor() {
    if (!selectedVendor) {
      alert("Please select a vendor");
      return;
    }

    await assignVendor({
      token: authToken,
      id: maintenance._id,
      // vendorId: selectedVendor as Id<"vendors">,
      vendorId: selectedVendor,

    });

    alert("Vendor assigned");
  }

  async function handleSaveSchedule() {
    if (!scheduledDate || !scheduledFrom || !scheduledTo) {
      alert("Please select date and time");
      return;
    }

    await scheduleMaintenance({
      token: authToken,
      id: maintenance._id,
      scheduledDate,
      scheduledTimeFrom: scheduledFrom,
      scheduledTimeTo: scheduledTo,
    });

    alert("Schedule saved");
  }

  // async function handleAddHours() {
  //   if (!hours || !maintenance.assignedVendorId) return;

  //   await logHours({
  //     token: authToken,
  //     id: maintenance._id,
  //     vendorId: maintenance.assignedVendorId,
  //     hours: Number(hours),
  //     note: hoursNote,
  //   });

  //   setHours("");
  //   setHoursNote("");
  //   setShowHoursModal(false);
  // }

//   async function handleAddHours() {
//   if (!maintenance.assignedVendorId) {
//     alert("Assign a vendor before logging hours");
//     return;
//   }

//   if (!hours || Number(hours) <= 0) {
//     alert("Enter valid hours");
//     return;
//   }

//   setUpdating(true);

//   await logHours({
//     token: authToken,
//     id: maintenance._id,
//     vendorId: maintenance.assignedVendorId,
//     hours: Number(hours),
//     note: hoursNote,
//   });

//   setUpdating(false);
//   setHours("");
//   setHoursNote("");
//   setShowHoursModal(false);

//   alert("Hours logged successfully");
// }
async function handleAddHours() {
  if (!maintenance.assignedVendorId) return;

  const numericHours = Number(hours);
  if (!numericHours || numericHours <= 0) return;

  try {
    setUpdating(true);

    await logHours({
      token: authToken,
      id: maintenance._id,
      vendorId: maintenance.assignedVendorId,
      hours: numericHours,
      note: hoursNote,
    });

    setHours("");
    setHoursNote("");
    setShowHoursModal(false);

  } finally {
    setUpdating(false);
  }
}

  async function handleDelete() {
    if (!confirm("Delete this maintenance request?")) return;

    await deleteRequest({
      token: authToken,
      id: maintenance._id,
    });

    router.push("/dashboard/maintenance/all");
  }


async function handleSaveAll() {
  try {
    setUpdating(true);

    // 1️⃣ Update status only
    await updateRequest({
  token: authToken,
  id: maintenance._id,
  updates: {
    status,
  },
});

// optimistic sync
setStatus(status);


    // 2️⃣ Update schedule (if filled)
    if (scheduledDate && scheduledFrom && scheduledTo) {
      await scheduleMaintenance({
        token: authToken,
        id: maintenance._id,
        scheduledDate,
        scheduledTimeFrom: scheduledFrom,
        scheduledTimeTo: scheduledTo,
      });
    }

    // 3️⃣ Assign vendor (if selected)
    if (selectedVendor) {
      await assignVendor({
        token: authToken,
        id: maintenance._id,
        vendorId: selectedVendor,
      });
    }

  } finally {
    setUpdating(false);
  }
}


  /* ---------------- HELPERS ---------------- */

  const canAssignVendor =
    !!scheduledDate && !!scheduledFrom && !!scheduledTo;

  const assignedVendorName =
    maintenance.assignedVendorId
      ? vendors.find(
          (v) => v._id === maintenance.assignedVendorId
        )?.name ?? "Not assigned"
      : "Not assigned";

  /* ---------------- UI ---------------- */


return (
  <div className="p-8 max-w-6xl mx-auto">
    {/* PAGE HEADER */}
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Maintenance Request
      </h1>
      <p className="text-gray-500 mt-1">
        Review and manage request details
      </p>
    </div>

    <MaintenanceNav />

    {/* MAIN CARD */}
    <div className="mt-6 bg-white border rounded-2xl shadow-sm p-8 space-y-10">

      {/* TITLE + DESCRIPTION */}
      <div>
        <h2 className="text-2xl font-semibold">
          {maintenance.title}
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl">
          {maintenance.description}
        </p>
      </div>

      {/* IMAGES */}
      {maintenance.images && maintenance.images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Uploaded Images
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {maintenance.images.map((storageId: string) => (
              <div
  key={storageId}
  className="relative h-64 w-full rounded-xl overflow-hidden border bg-gray-100 shadow-sm"
>
  <MaintenanceImage storageId={storageId} />
</div>

            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE SECTION */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">
          Schedule Visit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            className="border p-2 rounded-lg"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded-lg"
            value={scheduledFrom}
            onChange={(e) => setScheduledFrom(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded-lg"
            value={scheduledTo}
            onChange={(e) => setScheduledTo(e.target.value)}
          />
        </div>

        <button
          onClick={handleSaveSchedule}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg"
        >
          Save Schedule
        </button>
      </div>

      {/* ASSIGN VENDOR */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">
          Assign Vendor
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
  className="border p-2 rounded-lg w-full sm:w-72"
  value={selectedVendor ?? ""}
  onChange={(e) =>
    setSelectedVendor(
      e.target.value
        ? (e.target.value as Id<"vendors">)
        : undefined
    )
  }
>

            <option value="">Select vendor</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignVendor}
            disabled={!canAssignVendor}
            className={`px-5 py-2 rounded-lg text-white transition ${
              canAssignVendor
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Assign
          </button>
        </div>

        <p className="text-sm mt-3 text-gray-500">
          Assigned to: <strong>{assignedVendorName}</strong>
        </p>
      </div>

      {/* HOURS */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">
          Work Hours
        </h3>

        <button
          onClick={() => setShowHoursModal(true)}
          className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg"
        >
          Add Hours
        </button>
      </div>
      {/* STATUS */}
<div className="border-t pt-8">
  <h3 className="text-lg font-semibold mb-4">
    Manager Controls
  </h3>

  <select
    className="border p-2 rounded-lg w-full"
   value={status}
onChange={(e) => setStatus(e.target.value)}

  >
    <option value="open">Open</option>
    <option value="in-progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  {/* <button
    onClick={handleDelete}
    className="mt-6 bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg"
  >
    Delete Request
  </button> */}

  {updating && (
    <p className="text-sm text-gray-500 mt-3">
      Updating…
    </p>
  )}
</div>

<div className="border-t pt-8 flex justify-between items-center">
  <button
    onClick={handleDelete}
    className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg"
  >
    Delete Request
  </button>

  <button
    onClick={handleSaveAll}
    className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-lg"
  >
    Save Changes
  </button>
</div>


    </div>

    {/* MODAL */}
    {showHoursModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
          <h4 className="text-lg font-semibold mb-4">
            Log Work Hours
          </h4>

          <input
            type="number"
            className="border p-2 w-full mb-3 rounded-lg"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <textarea
            className="border p-2 w-full mb-4 rounded-lg"
            placeholder="Note"
            value={hoursNote}
            onChange={(e) => setHoursNote(e.target.value)}
          />

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowHoursModal(false)}
              className="text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleAddHours}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
