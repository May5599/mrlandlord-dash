// "use client";

// import { useParams } from "next/navigation";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

// export default function VendorDetailsPage() {
//   const { id } = useParams();

//   const vendor = useQuery(api.vendors.getVendorById, { id: id as any });
//   const jobs = useQuery(api.maintenance.getRequestsByVendor, {
//     vendorId: id as any,
//   });

//   if (!vendor || !jobs) return <p className="p-8">Loading...</p>;

//   // Flatten hours log for this vendor
//   const hours = jobs.flatMap((j) =>
//     (j.hoursLog ?? []).filter((h) => h.vendorId === id)
//   );

//   // Helpers
//   const today = new Date().toDateString();
//   const startOfWeek = new Date();
//   startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

//   const startOfMonth = new Date();
//   startOfMonth.setDate(1);

//   const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);

//   const todayHours = hours.filter(
//     (h) => new Date(h.date).toDateString() === today
//   ).reduce((sum, h) => sum + h.hours, 0);

//   const weekHours = hours.filter((h) => {
//     const d = new Date(h.date);
//     return d >= startOfWeek;
//   }).reduce((sum, h) => sum + h.hours, 0);

//   const monthHours = hours.filter((h) => {
//     const d = new Date(h.date);
//     return d >= startOfMonth;
//   }).reduce((sum, h) => sum + h.hours, 0);

//   const activeJobs = jobs.filter((j) => j.status === "in-progress");
//   const completedJobs = jobs.filter((j) => j.status === "completed");

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-2">{vendor.name}</h1>
//       <p className="text-gray-600 mb-6">Vendor Performance Overview</p>

//       {/* STATS */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <Stat title="Total Hours" value={totalHours} />
//         <Stat title="Today" value={todayHours} />
//         <Stat title="This Week" value={weekHours} />
//         <Stat title="This Month" value={monthHours} />
//       </div>

//       {/* JOBS */}
//       <h2 className="text-xl font-semibold mt-8">Jobs Overview</h2>

//       <div className="grid grid-cols-3 gap-6 mt-4">
//         <Stat title="Assigned Jobs" value={jobs.length} />
//         <Stat title="Active Jobs" value={activeJobs.length} />
//         <Stat title="Completed Jobs" value={completedJobs.length} />
//       </div>

//       {/* HOURS PER JOB */}
//       <h2 className="text-xl font-semibold mt-10">Hours Logged per Job</h2>

//       <div className="mt-4 space-y-4">
//         {jobs.map((job) => {
//           const jobHours = (job.hoursLog ?? [])
//             .filter((h) => h.vendorId === id)
//             .reduce((s, h) => s + h.hours, 0);

//           return (
//             <div key={job._id} className="p-4 border rounded-xl bg-gray-50">
//               <p className="font-semibold">{job.title}</p>
//               <p className="text-sm text-gray-600">
//                 {jobHours} hours logged
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function Stat({ title, value }: any) {
//   return (
//     <div className="bg-white border rounded-xl p-5 shadow-sm">
//       <p className="text-gray-500 text-sm">{title}</p>
//       <h3 className="text-2xl font-semibold mt-2">{value}</h3>
//     </div>
//   );


// }


"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import MaintenanceNav from "../maintenance/MaintenanceNav";
import Link from "next/link";

export default function VendorsPage() {
  const vendors = useQuery(api.vendors.getVendors) ?? [];
  const addVendor = useMutation(api.vendors.addVendor);
  const removeVendor = useMutation(api.vendors.deleteVendor);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    specialty: "",
  });

  const handleAdd = async () => {
    if (!form.name || !form.phone) {
      alert("Name and phone are required");
      return;
    }

    await addVendor({
      name: form.name,
      phone: form.phone,
      email: form.email || "",
      specialty: form.specialty || "",
      createdAt: new Date().toISOString(),
    });

    setForm({ name: "", phone: "", email: "", specialty: "" });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Vendors & Contractors</h1>
      <p className="text-gray-600 mb-6">
        Add trusted vendors for plumbing, electrical, HVAC, cleaning, and general repairs.
      </p>

      <MaintenanceNav />

      {/* ADD VENDOR FORM */}
      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-xl mt-6">
        <h2 className="font-semibold mb-4 text-lg">Add New Vendor</h2>

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
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Specialty (Plumber, Electrician, HVAC, etc)"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
        />

        <button
          className="w-full bg-indigo-600 text-white p-2 rounded"
          onClick={handleAdd}
        >
          Add Vendor
        </button>
      </div>

      {/* VENDORS LIST */}
      <div className="mt-8 bg-white border rounded-xl shadow-sm p-6">
        <h2 className="font-semibold mb-4 text-lg">All Vendors</h2>

        {vendors.length === 0 ? (
          <p className="text-gray-500">No vendors added yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Specialty</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{v.name}</td>
                  <td className="p-2">{v.phone}</td>
                  <td className="p-2">{v.specialty}</td>
                  <td className="p-2 flex gap-4">
                    {/* VIEW DASHBOARD */}
                    <Link
                      href={`/dashboard/vendors/${v._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View Dashboard
                    </Link>

                    {/* DELETE */}
                    <button
                      onClick={() => removeVendor({ id: v._id })}
                      className="text-red-600 hover:underline"
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
