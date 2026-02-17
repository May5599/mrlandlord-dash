
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../maintenance/MaintenanceNav";
import Link from "next/link";
import { useSessionToken } from "@/hooks/useSessionToken";
import { Id } from "@/convex/_generated/dataModel";


export default function VendorsPage() {
  const token = useSessionToken();
  const isReady = !!token;

  if (!token) {
  return <p className="p-8">Loading…</p>;
}


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

 const handleDelete = async (id: Id<"vendors">) => {

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
                  <td className="p-2">{v.specialty || " "}</td>
                  <td className="p-2 flex gap-4">
                    <Link
                      href={`/dashboard/vendors/${v._id}`}
                      className="text-indigo-600"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(v._id as Id<"vendors">)}

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
