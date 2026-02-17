

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
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [hoursNote, setHoursNote] = useState<string>("");
  const [showHoursModal, setShowHoursModal] = useState(false);

  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledFrom, setScheduledFrom] = useState<string>("");
  const [scheduledTo, setScheduledTo] = useState<string>("");

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    if (!request) return;

    if (request.assignedVendorId) {
      setSelectedVendor(request.assignedVendorId);
    }

    if (request.scheduledDate) {
      setScheduledDate(request.scheduledDate);
      setScheduledFrom(request.scheduledTimeFrom ?? "");
      setScheduledTo(request.scheduledTimeTo ?? "");
    }
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

  async function handleStatusChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    setUpdating(true);

    await updateRequest({
      token: authToken,
      id: maintenance._id,
      updates: { status: e.target.value },
    });

    setUpdating(false);
  }

  async function handleAssignVendor() {
    if (!selectedVendor) {
      alert("Please select a vendor");
      return;
    }

    await assignVendor({
      token: authToken,
      id: maintenance._id,
      vendorId: selectedVendor as Id<"vendors">,
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

  async function handleAddHours() {
    if (!hours || !maintenance.assignedVendorId) return;

    await logHours({
      token: authToken,
      id: maintenance._id,
      vendorId: maintenance.assignedVendorId,
      hours: Number(hours),
      note: hoursNote,
    });

    setHours("");
    setHoursNote("");
    setShowHoursModal(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this maintenance request?")) return;

    await deleteRequest({
      token: authToken,
      id: maintenance._id,
    });

    router.push("/dashboard/maintenance/all");
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
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">
        Request Details
      </h1>
      <p className="text-gray-600 mb-6">
        Full maintenance request view
      </p>

      {/* IMAGES */}
{maintenance.images && maintenance.images.length > 0 && (
  <div className="mt-6">
    <h3 className="font-semibold mb-3">
      Uploaded Images
    </h3>

    <div className="flex flex-wrap gap-4">
      {maintenance.images.map((storageId: string) => (
        <div key={storageId} className="w-32 h-32">
          <MaintenanceImage storageId={storageId} />
        </div>
      ))}
    </div>
  </div>
)}

      

      <MaintenanceNav />

      <div className="mt-6 bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold">
          {maintenance.title}
        </h2>
        <p className="text-gray-700 mt-3">
          {maintenance.description}
        </p>

        {/* SCHEDULE */}
        <h3 className="mt-8 font-semibold">
          Schedule Visit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <input
            type="date"
            className="border p-2 rounded"
            value={scheduledDate}
            onChange={(e) =>
              setScheduledDate(e.target.value)
            }
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={scheduledFrom}
            onChange={(e) =>
              setScheduledFrom(e.target.value)
            }
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={scheduledTo}
            onChange={(e) =>
              setScheduledTo(e.target.value)
            }
          />
        </div>

        <button
          onClick={handleSaveSchedule}
          className="mt-3 px-4 py-2 rounded text-white bg-blue-600"
        >
          Save Schedule
        </button>

        {/* ASSIGN VENDOR */}
        <h3 className="mt-10 font-semibold">
          Assign Vendor
        </h3>

        <div className="flex gap-4 mt-3">
          <select
            className="border p-2 rounded w-64"
            value={selectedVendor}
            onChange={(e) =>
              setSelectedVendor(e.target.value)
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
            className={`px-4 py-2 rounded text-white ${
              canAssignVendor
                ? "bg-indigo-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Assign
          </button>
        </div>

        <p className="text-sm mt-2 text-gray-600">
          Assigned to:{" "}
          <strong>{assignedVendorName}</strong>
        </p>

        {/* HOURS */}
        <h3 className="mt-10 font-semibold">
          Work Hours
        </h3>

        <button
          onClick={() => setShowHoursModal(true)}
          className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
        >
          Add Hours
        </button>

        {showHoursModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96">
              <input
                type="number"
                className="border p-2 w-full mb-3"
                placeholder="Hours"
                value={hours}
                onChange={(e) =>
                  setHours(e.target.value)
                }
              />

              <textarea
                className="border p-2 w-full mb-3"
                placeholder="Note"
                value={hoursNote}
                onChange={(e) =>
                  setHoursNote(e.target.value)
                }
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() =>
                    setShowHoursModal(false)
                  }
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

        {/* STATUS */}
        <h3 className="mt-10 font-semibold">
          Manager Controls
        </h3>

        <select
          className="border p-2 rounded w-full mt-2"
          value={maintenance.status}
          onChange={handleStatusChange}
        >
          <option value="open">Open</option>
          <option value="in-progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
        </select>

        <button
          onClick={handleDelete}
          className="mt-8 bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Request
        </button>

        {updating && (
          <p className="text-sm text-gray-500 mt-2">
            Updating…
          </p>
        )}
      </div>
    </div>
  );
}
