"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import MaintenanceNav from "../MaintenanceNav";

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
      <p className="text-gray-600 mb-6">Add trusted vendors for plumbing, electrical, HVAC, cleaning, and general repairs.</p>

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
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{v.name}</td>
                  <td className="p-2">{v.phone}</td>
                  <td className="p-2">{v.specialty}</td>
                  <td className="p-2">
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
