"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../../maintenance/MaintenanceNav";
import { Id } from "@/convex/_generated/dataModel";
import { useSessionToken } from "@/hooks/useSessionToken";

/* ----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default function VendorDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  /* ----------------------------------------------------------
     AUTH (SESSION TOKEN)
  ----------------------------------------------------------- */
  const token = useSessionToken();
  const isReady = !!token && !!id;

  /* ----------------------------------------------------------
     QUERIES (COMPANY SCOPED)
  ----------------------------------------------------------- */
  const vendor =
    useQuery(
      api.vendors.getVendorById,
      isReady
        ? { token, id: id as Id<"vendors"> }
        : "skip"
    ) ?? null;

  const jobs =
    useQuery(
      api.maintenance.getRequestsByVendor,
      isReady
        ? { token, vendorId: id as Id<"vendors"> }
        : "skip"
    ) ?? [];

  if (!id) {
    return <p className="p-8">Invalid vendor ID</p>;
  }

  if (!isReady || !vendor) {
    return <p className="p-8">Loading vendor...</p>;
  }

  const totalHours = jobs.reduce((sum, job) => {
    const hours =
      job.hoursLog?.reduce(
        (s: number, h: { hours: number }) => s + h.hours,
        0
      ) ?? 0;

    return sum + hours;
  }, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">
        Vendor Overview
      </h1>
      <p className="text-gray-600 mb-6">
        Performance and activity summary.
      </p>

      <MaintenanceNav />

      {/* VENDOR INFO */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">
        <h2 className="text-xl font-semibold">{vendor.name}</h2>
        <p className="text-gray-700 mt-2">
          {vendor.specialty || "General contractor"}
        </p>

        <div className="grid grid-cols-3 gap-6 mt-6 text-sm">
          <Detail label="Phone" value={vendor.phone} />
          <Detail
            label="Email"
            value={vendor.email || "Not provided"}
          />
          <Detail
            label="Created"
            value={new Date(vendor.createdAt).toLocaleDateString()}
          />
        </div>
      </div>

      {/* WORK SUMMARY */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Work Summary
        </h3>

        <p className="text-sm">
          <strong>Total Jobs Assigned:</strong> {jobs.length}
        </p>

        <p className="text-sm mt-2">
          <strong>Total Hours Logged:</strong> {totalHours} hrs
        </p>
      </div>

      {/* JOB LIST */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Assigned Jobs
        </h3>

        {jobs.length === 0 ? (
          <p className="text-gray-500">
            No jobs assigned to this vendor yet.
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const jobHours =
                job.hoursLog?.reduce(
                  (s: number, h: { hours: number }) =>
                    s + h.hours,
                  0
                ) ?? 0;

              return (
                <div
                  key={job._id}
                  className="p-3 border rounded-xl bg-gray-50 hover:bg-gray-100"
                >
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-xs text-gray-600">
                    Status: {job.status} | Hours logged: {jobHours}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   UI HELPERS
----------------------------------------------------------- */
function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}
