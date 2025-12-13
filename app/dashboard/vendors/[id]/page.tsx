"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../../maintenance/MaintenanceNav";
import { Id } from "@/convex/_generated/dataModel";


export default function VendorDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

 const vendor = useQuery(
  api.vendors.getVendorById,
  id ? { id: id as Id<"vendors"> } : "skip"
);

const jobs = useQuery(
  api.maintenance.getRequestsByVendor,
  id ? { vendorId: id as Id<"vendors"> } : "skip"
);


  if (!id) return <p className="p-8">Invalid vendor ID</p>;
  if (!vendor) return <p className="p-8">Loading vendor...</p>;

  const totalHours = jobs?.reduce((sum, job) => {
    return (
      sum +
      (job.hoursLog?.reduce((s: number, h: any) => s + h.hours, 0) ?? 0)
    );
  }, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Vendor Overview</h1>
      <p className="text-gray-600 mb-6">Performance and activity summary.</p>

      <MaintenanceNav />

      {/* Vendor Info */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">
        <h2 className="text-xl font-semibold">{vendor.name}</h2>
        <p className="text-gray-700 mt-2">
          {vendor.specialty || "General contractor"}
        </p>

        <div className="grid grid-cols-3 gap-6 mt-6 text-sm">
          <Detail label="Phone" value={vendor.phone} />
          <Detail label="Email" value={vendor.email || "Not provided"} />
          <Detail label="Created" value={new Date(vendor.createdAt).toLocaleDateString()} />
        </div>
      </div>

      {/* Work Summary */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mt-8">
        <h3 className="text-lg font-semibold mb-4">Work Summary</h3>

        <p className="text-sm">
          <strong>Total Jobs Assigned:</strong> {jobs?.length ?? 0}
        </p>

        <p className="text-sm mt-2">
          <strong>Total Hours Logged:</strong> {totalHours ?? 0} hrs
        </p>
      </div>

      {/* Job List */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mt-8">
        <h3 className="text-lg font-semibold mb-4">Assigned Jobs</h3>

        {jobs?.length === 0 ? (
          <p className="text-gray-500">No jobs assigned to this vendor yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs?.map((job) => (
              <div
                key={job._id}
                className="p-3 border rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <p className="font-semibold">{job.title}</p>
                <p className="text-xs text-gray-600">
                  Status: {job.status}  
                  | Hours logged: {job.hoursLog?.reduce((s: number, h: any) => s + h.hours, 0) ?? 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}
