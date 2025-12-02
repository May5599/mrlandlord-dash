"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TenantsNav from "../TenantsNav";
import { useRouter } from "next/navigation";

/* ----------------------------------------------------------
   TYPES
----------------------------------------------------------- */
type TenantFormData = {
  name: string;
  phone: string;
  email: string;
  dob: string;
  profileImage?: string;

  leaseStart: string;
  leaseEnd: string;

  rentAmount: string;
  rentFrequency: "monthly";

  deposit: string;

  propertyId: Id<"properties"> | "";
  unitId: Id<"units"> | "";

  status: "active" | "vacated" | "pending";

  notes: { message: string; createdAt: string }[];

  documents: {
    type: string;
    url: string;
    uploadedAt: string;
  }[];
};

/* ----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default function NewTenantPage() {
  const router = useRouter();

  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];

  const createTenant = useMutation(api.tenants.createTenant);

  /* ----------------------------------------------------------
     STATE (FIXED)
  ----------------------------------------------------------- */
  const [data, setData] = useState<TenantFormData>({
    name: "",
    phone: "",
    email: "",
    dob: "",
    profileImage: "",

    leaseStart: "",
    leaseEnd: "",

    rentAmount: "",
    rentFrequency: "monthly",

    deposit: "",

    propertyId: "",
    unitId: "",

    status: "active",

    notes: [],
    documents: [],
  });

  /* ----------------------------------------------------------
     FILTER UNITS BY PROPERTY
  ----------------------------------------------------------- */
  const filteredUnits = useMemo(() => {
    if (!data.propertyId) return [];
    return units.filter((u) => u.propertyId === data.propertyId);
  }, [data.propertyId, units]);

  /* ----------------------------------------------------------
     HANDLE SUBMIT (FIXED)
  ----------------------------------------------------------- */
  const handleSubmit = async () => {
    if (!data.name || !data.phone || !data.email) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!data.propertyId || !data.unitId) {
      alert("Please select both property and unit.");
      return;
    }

    await createTenant({
  name: data.name,
  phone: data.phone,
  email: data.email,
  dob: data.dob || undefined,
  profileImage: data.profileImage || undefined,

  leaseStart: data.leaseStart,
  leaseEnd: data.leaseEnd === "" ? undefined : data.leaseEnd,

  rentAmount: Number(data.rentAmount),
  rentFrequency: data.rentFrequency,
  deposit: Number(data.deposit),

  propertyId: data.propertyId!,
  unitId: data.unitId!,

  status: data.status,

  notes: data.notes ?? [], // OK because notes is also an array
  documents: data.documents, // FIXED — no ??
  
//   createdAt: new Date().toISOString(),
});

    router.push("/dashboard/tenants/all");
  };

  /* ----------------------------------------------------------
     UI
  ----------------------------------------------------------- */
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Add Tenant</h1>
      <p className="text-gray-600 mb-6">
        Create a new tenant and link them to a property and unit.
      </p>

      <TenantsNav />

      <div className="bg-white p-6 rounded-xl border shadow-sm mt-6 w-full max-w-xl">
        
        {/* FULL NAME */}
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Full Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        {/* PHONE */}
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />

        {/* EMAIL */}
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        {/* DOB */}
        <input
          type="date"
          className="w-full border p-2 rounded mb-4"
          value={data.dob}
          onChange={(e) => setData({ ...data, dob: e.target.value })}
        />

        {/* LEASE START */}
        <input
          type="date"
          className="w-full border p-2 rounded mb-4"
          value={data.leaseStart}
          onChange={(e) => setData({ ...data, leaseStart: e.target.value })}
        />

        {/* LEASE END */}
        <input
          type="date"
          className="w-full border p-2 rounded mb-4"
          value={data.leaseEnd}
          onChange={(e) => setData({ ...data, leaseEnd: e.target.value })}
        />

        {/* RENT */}
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Rent Amount"
          value={data.rentAmount}
          onChange={(e) => setData({ ...data, rentAmount: e.target.value })}
        />

        {/* DEPOSIT */}
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Deposit Amount"
          value={data.deposit}
          onChange={(e) => setData({ ...data, deposit: e.target.value })}
        />

        {/* PROPERTY */}
        <select
          className="w-full border p-2 rounded mb-4"
          value={data.propertyId}
          onChange={(e) =>
            setData({
              ...data,
              propertyId: e.target.value as Id<"properties">,
              unitId: "",
            })
          }
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* UNIT */}
        <select
          className="w-full border p-2 rounded mb-4"
          value={data.unitId}
          disabled={!data.propertyId}
          onChange={(e) =>
            setData({
              ...data,
              unitId: e.target.value as Id<"units">,
            })
          }
        >
          <option value="">Select Unit</option>
          {filteredUnits.map((u) => (
            <option key={u._id} value={u._id}>
              {u.unitNumber}
            </option>
          ))}
        </select>

        {/* STATUS */}
        <select
          className="w-full border p-2 rounded mb-4"
          value={data.status}
          onChange={(e) =>
            setData({
              ...data,
              status: e.target.value as TenantFormData["status"],
            })
          }
        >
          <option value="active">Active</option>
          <option value="pending">Pending Move-in</option>
          <option value="vacated">Vacated</option>
        </select>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white p-2 rounded mt-2"
        >
          Add Tenant
        </button>
      </div>
    </div>
  );
}
