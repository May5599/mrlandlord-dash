

"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TenantsNav from "../TenantsNav";
import { useRouter } from "next/navigation";
import { useSessionToken } from "@/hooks/useSessionToken";

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

  const token = useSessionToken();
  const isReady = !!token;

  const properties =
    useQuery(
      api.properties.getAllProperties,
      isReady ? { token } : "skip"
    ) ?? [];

  const units =
    useQuery(
      api.units.getAllUnits,
      isReady ? { token } : "skip"
    ) ?? [];

  // const createTenant = useMutation(api.tenants.createTenant);

  /* ----------------------------------------------------------
     STATE
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
     HANDLE SUBMIT
  ----------------------------------------------------------- */
//   const handleSubmit = async () => {
//   if (!token) return;

//   if (!data.leaseStart || !data.rentAmount || !data.deposit) {
//   alert("Please fill in lease details.");
//   return;
// }


//   if (!data.propertyId || !data.unitId) {
//     alert("Please select both property and unit.");
//     return;
//   }

//   const res = await fetch("/api/admin/create-tenant", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       token,

//       name: data.name,
//       phone: data.phone,
//       email: data.email,
//       dob: data.dob === "" ? undefined : data.dob,


//       leaseStart: data.leaseStart,
//       leaseEnd: data.leaseEnd === "" ? undefined : data.leaseEnd,

//       rentAmount: Number(data.rentAmount),
//       rentFrequency: data.rentFrequency,
//       deposit: Number(data.deposit),

//       propertyId: data.propertyId,
//       unitId: data.unitId,

//       status: data.status,
//     }),
//   });

//   const result = await res.json();

//   if (!result.success) {
//     alert(result.message || "Failed to create tenant");
//     return;
//   }

//   // 🔐 Show password ONCE to admin
//   alert(`Tenant temporary password: ${result.tempPassword}`);

//   router.push("/dashboard/tenants/all");
// };

const handleSubmit = async () => {
  if (!token) return;

  if (!data.name || !data.phone || !data.email) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!data.leaseStart) {
  alert("Lease start date is required.");
  return;
}

if (data.rentAmount.trim() === "" || data.deposit.trim() === "") {
  alert("Rent and deposit are required.");
  return;
}


  if (!data.propertyId || !data.unitId) {
    alert("Please select both property and unit.");
    return;
  }

  const rentAmount = Number(data.rentAmount);
  const deposit = Number(data.deposit);

  if (Number.isNaN(rentAmount) || Number.isNaN(deposit)) {
    alert("Rent and deposit must be valid numbers.");
    return;
  }

  const res = await fetch("/api/admin/create-tenant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,

      name: data.name,
      phone: data.phone,
      email: data.email,
      dob: data.dob === "" ? undefined : data.dob,

      leaseStart: data.leaseStart,
      leaseEnd: data.leaseEnd === "" ? undefined : data.leaseEnd,

      rentAmount,
      rentFrequency: data.rentFrequency,
      deposit,

      propertyId: data.propertyId,
      unitId: data.unitId,

      status: data.status,
    }),
  });

  const result = await res.json();

  if (!result.success) {
    alert(result.message || "Failed to create tenant");
    return;
  }

  alert(`Tenant temporary password: ${result.tempPassword}`);

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

     <div className="bg-white p-8 rounded-2xl border shadow-sm mt-6 w-full max-w-2xl">

  {/* ================= BASIC INFO ================= */}
  <h2 className="text-lg font-semibold mb-6">
    Basic Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm font-medium mb-1">
        Full Name *
      </label>
      <input
        className="w-full border p-2 rounded-lg"
        value={data.name}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Phone *
      </label>
      <input
        className="w-full border p-2 rounded-lg"
        value={data.phone}
        onChange={(e) =>
          setData({ ...data, phone: e.target.value })
        }
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">
        Email *
      </label>
      <input
        type="email"
        className="w-full border p-2 rounded-lg"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Date of Birth
      </label>
      <input
        type="date"
        className="w-full border p-2 rounded-lg"
        value={data.dob}
        onChange={(e) =>
          setData({ ...data, dob: e.target.value })
        }
      />
    </div>

  </div>


  {/* ================= LEASE INFO ================= */}
  <h2 className="text-lg font-semibold mt-10 mb-6">
    Lease Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm font-medium mb-1">
        Lease Start Date *
      </label>
      <input
        type="date"
        className="w-full border p-2 rounded-lg"
        value={data.leaseStart}
        onChange={(e) =>
          setData({ ...data, leaseStart: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Lease End Date
      </label>
      <input
        type="date"
        className="w-full border p-2 rounded-lg"
        value={data.leaseEnd}
        onChange={(e) =>
          setData({ ...data, leaseEnd: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Rent Amount *
      </label>
      <input
        type="number"
        className="w-full border p-2 rounded-lg"
        value={data.rentAmount}
        onChange={(e) =>
          setData({ ...data, rentAmount: e.target.value })
        }
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Deposit Amount *
      </label>
      <input
        type="number"
        className="w-full border p-2 rounded-lg"
        value={data.deposit}
        onChange={(e) =>
          setData({ ...data, deposit: e.target.value })
        }
      />
    </div>

  </div>


  {/* ================= PROPERTY ASSIGNMENT ================= */}
  <h2 className="text-lg font-semibold mt-10 mb-6">
    Property Assignment
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm font-medium mb-1">
        Property *
      </label>
      <select
        className="w-full border p-2 rounded-lg"
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
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Unit *
      </label>
      <select
        className="w-full border p-2 rounded-lg"
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
    </div>

  </div>


  {/* ================= STATUS ================= */}
  <h2 className="text-lg font-semibold mt-10 mb-6">
    Tenant Status
  </h2>

  <select
    className="w-full border p-2 rounded-lg"
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


  {/* ================= SUBMIT ================= */}
  <div className="mt-10">
    <button
      onClick={handleSubmit}
      className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-medium"
    >
      Add Tenant
    </button>
  </div>

</div>



    </div>
  );
}
