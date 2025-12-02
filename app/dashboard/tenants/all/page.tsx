"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import TenantsNav from "../../tenants/TenantsNav";

/* ----------------------------------------------------------
   TYPES
----------------------------------------------------------- */
type TenantFormData = {
  name: string;
  phone: string;
  email: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: string;
  deposit: string;
  propertyId: Id<"properties"> | "";
  unitId: Id<"units"> | "";
  status: "active" | "vacated" | "pending";
  notes: string;
};

/* ----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default function AllTenantsPage() {
  const tenants = useQuery(api.tenants.getAllTenants) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];
  const properties = useQuery(api.properties.getAllProperties) ?? [];

  const updateTenant = useMutation(api.tenants.updateTenant);
  const deleteTenant = useMutation(api.tenants.deleteTenant);
  const moveOutTenant = useMutation(api.tenants.moveOutTenant);

  /* ----------------------------------------------------------
     FILTERS
  ----------------------------------------------------------- */
  const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState<"all" | TenantFormData["status"]>("all");

  const [filterProperty, setFilterProperty] = useState<"all" | Id<"properties">>("all");


  const filteredTenants = tenants.filter((t) => {
    const unit = units.find((u) => u._id === t.unitId);
    const property = properties.find((p) => p._id === t.propertyId);

    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      property?.name.toLowerCase().includes(search.toLowerCase()) ||
      unit?.unitNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || t.status === filterStatus;

    const matchesProperty =
      filterProperty === "all" || t.propertyId === filterProperty;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  /* ----------------------------------------------------------
     EDIT MODAL
  ----------------------------------------------------------- */
  const [showEdit, setShowEdit] = useState(false);
  const [editTenant, setEditTenant] = useState<
    (TenantFormData & { _id: Id<"tenants"> }) | null
  >(null);

  const openEdit = (t: Doc<"tenants">) => {
    setEditTenant({
      _id: t._id,
      name: t.name,
      phone: t.phone,
      email: t.email,
      leaseStart: t.leaseStart,
      leaseEnd: t.leaseEnd ?? "",
      rentAmount: String(t.rentAmount),
      deposit: String(t.deposit),
      propertyId: t.propertyId,
      unitId: t.unitId,
      status: t.status as "active" | "vacated" | "pending",
      notes: "",
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editTenant) return;

    await updateTenant({
      id: editTenant._id,
      updates: {
        name: editTenant.name,
        phone: editTenant.phone,
        email: editTenant.email,
        leaseStart: editTenant.leaseStart,
        leaseEnd: editTenant.leaseEnd,
        rentAmount: Number(editTenant.rentAmount),
        deposit: Number(editTenant.deposit),
        status: editTenant.status,
      },
    });

    setShowEdit(false);
  };

  /* ----------------------------------------------------------
     DELETE
  ----------------------------------------------------------- */
  const handleDelete = async (id: Id<"tenants">) => {
    if (!confirm("Delete this tenant?")) return;
    await deleteTenant({ id });
  };

  /* ----------------------------------------------------------
     MOVE OUT
  ----------------------------------------------------------- */
  const handleMoveOut = async (t: Doc<"tenants">) => {
    if (!confirm("Mark tenant as moved out?")) return;

    await moveOutTenant({
      tenantId: t._id,
      unitId: t.unitId,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">All Tenants</h1>
      <p className="text-gray-500 mb-6">
        Manage tenant records across all properties.
      </p>

      <TenantsNav />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-4 items-center">
        <input
          placeholder="Search tenant, property, or unit..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
  className="border p-2 rounded"
  value={filterProperty}
  onChange={(e) =>
    setFilterProperty(e.target.value as "all" | Id<"properties">)
  }
>
  <option value="all">All Properties</option>
  {properties.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>


        <select
  className="border p-2 rounded"
  value={filterStatus}
  onChange={(e) =>
    setFilterStatus(
      e.target.value as "all" | TenantFormData["status"]
    )
  }
>
  <option value="all">Any Status</option>
  <option value="active">Active</option>
  <option value="vacated">Vacated</option>
  <option value="pending">Pending Move-in</option>
</select>

      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Tenant</th>
              <th className="p-3">Property</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Lease Ends</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTenants.map((t) => {
              const unit = units.find((u) => u._id === t.unitId);
              const property = properties.find((p) => p._id === t.propertyId);

              return (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium"><a
    href={`/dashboard/tenants/${t._id}`}
    className="text-indigo-600 hover:underline"
  >
    {t.name}
  </a></td>
                  <td className="p-3">{property?.name ?? "—"}</td>
                  <td className="p-3">{unit?.unitNumber ?? "—"}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.email}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        t.status === "active"
                          ? "bg-green-100 text-green-700"
                          : t.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="p-3">{t.leaseEnd ?? "—"}</td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(t)}
                      className="text-indigo-600 mr-4"
                    >
                      Edit
                    </button>

                    {t.status === "active" && (
                      <button
                        onClick={() => handleMoveOut(t)}
                        className="text-orange-600 mr-4"
                      >
                        Move Out
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEdit && editTenant && (
  <Modal title="Edit Tenant" onClose={() => setShowEdit(false)}>
    <TenantForm
      data={editTenant}
      setData={setEditTenant}

      onSubmit={handleUpdate}
    />
  </Modal>
)}

    </div>
  );
}

/* ----------------------------------------------------------
   REUSABLE COMPONENTS
----------------------------------------------------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[450px]">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button className="mt-4 text-gray-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

type TenantFormProps = {
  data: (TenantFormData & { _id: Id<"tenants"> }) | null;
  setData: React.Dispatch<
    React.SetStateAction<(TenantFormData & { _id: Id<"tenants"> }) | null>
  >;
  onSubmit: () => void;
};


function TenantForm({ data, setData, onSubmit }: TenantFormProps) {
  if (!data) return null;

  return (
    <>
      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Full Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Phone"
        value={data.phone}
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        type="date"
        className="w-full border p-2 rounded mb-3"
        value={data.leaseStart}
        onChange={(e) => setData({ ...data, leaseStart: e.target.value })}
      />

      <input
        type="date"
        className="w-full border p-2 rounded mb-3"
        value={data.leaseEnd}
        onChange={(e) => setData({ ...data, leaseEnd: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Rent Amount"
        value={data.rentAmount}
        onChange={(e) => setData({ ...data, rentAmount: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Deposit"
        value={data.deposit}
        onChange={(e) => setData({ ...data, deposit: e.target.value })}
      />

      <select
        className="w-full border p-2 rounded mb-3"
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

      <button
        onClick={onSubmit}
        className="w-full bg-indigo-600 text-white p-2 rounded mt-2"
      >
        Save
      </button>
    </>
  );
}
