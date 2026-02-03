
"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import PropertiesNav from "../PropertiesNav";
import { useSessionToken } from "@/hooks/useSessionToken";

export default function PropertyListPage() {
const token = useSessionToken();
const isLoadingSession = token === null;
const isReady = Boolean(token);


  // -------------------- Queries --------------------
  const properties =
    useQuery(
      api.properties.getAllProperties,
      isReady ? { token: token! } : "skip"
    ) ?? [];

  const units =
    useQuery(
      api.units.getAllUnits,
      isReady ? { token: token! } : "skip"
    ) ?? [];

  // -------------------- Mutations --------------------
  const createProperty = useMutation(api.properties.createProperty);
  const updateProperty = useMutation(api.properties.updateProperty);
  const deleteProperty = useMutation(api.properties.deleteProperty);

  // -------------------- Filters --------------------
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());

    const matchesCity = cityFilter === "all" || p.city === cityFilter;

    return matchesSearch && matchesCity;
  });

  const allCities = [...new Set(properties.map((p) => p.city))];

  // -------------------- Add Modal --------------------
  const [showAdd, setShowAdd] = useState(false);
  const [newProp, setNewProp] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Canada",
  });

  const handleAdd = async () => {
    if (!token) return;

    await createProperty({
      token,
      ...newProp,
    });

    setNewProp({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Canada",
    });

    setShowAdd(false);
  };

  // -------------------- Edit Modal --------------------
  const [showEdit, setShowEdit] = useState(false);
  const [editProp, setEditProp] =
    useState<(PropertyFormData & { _id: Id<"properties"> }) | null>(null);

  const openEdit = (p: Doc<"properties">) => {
    setEditProp({
      _id: p._id,
      name: p.name,
      address: p.address,
      city: p.city,
      postalCode: p.postalCode,
      country: p.country,
    });
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!token || !editProp) return;

    await updateProperty({
      token,
      propertyId: editProp._id,
      updates: {
        name: editProp.name,
        address: editProp.address,
        city: editProp.city,
        postalCode: editProp.postalCode,
        country: editProp.country,
      },
    });

    setShowEdit(false);
  };

  // -------------------- Delete --------------------
  const handleDelete = async (propertyId: Id<"properties">) => {
    if (!token) return;
    if (!confirm("Delete this property?")) return;

    await deleteProperty({
      token,
      propertyId,
    });
  };

  // -------------------- Helpers --------------------
  const getUnitSummary = (propertyId: Id<"properties">) => {
    const list = units.filter((u) => u.propertyId === propertyId);
    const occupied = list.filter((u) => u.status === "occupied").length;
    const vacant = list.filter((u) => u.status === "vacant").length;
    return { total: list.length, occupied, vacant };
  };

  const vacantUnitsCount = units.filter(
    (u) => u.status === "vacant"
  ).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Properties
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your company’s property portfolio
          </p>
        </div>

        {isLoadingSession && (
  <p className="text-sm text-gray-400 mt-2">
    Preparing your session…
  </p>
)}


        <button
  onClick={() => setShowAdd(true)}
  disabled={isLoadingSession}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
    isLoadingSession
      ? "bg-gray-200 text-gray-400 cursor-wait"
      : "bg-indigo-600 hover:bg-indigo-700 text-white"
  }`}
>
  {isLoadingSession ? "Loading…" : "+ Add Property"}
</button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Properties</p>
          <p className="text-2xl font-semibold mt-1">
            {properties.length}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-2xl font-semibold mt-1">
            {units.length}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Vacant Units</p>
          <p className="text-2xl font-semibold mt-1 text-blue-600">
            {vacantUnitsCount}
          </p>
        </div>
      </div>

      <PropertiesNav />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-4 items-center">
        <input
          placeholder="Search name or city..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="all">All Cities</option>
          {allCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Address</th>
              <th className="p-3">City</th>
              <th className="p-3">Units</th>
              <th className="p-3">Occupied</th>
              <th className="p-3">Vacant</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => {
              const s = getUnitSummary(p._id);
              return (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{s.total}</td>
                  <td className="p-3 text-green-600">{s.occupied}</td>
                  <td className="p-3 text-blue-600">{s.vacant}</td>

                  <td className="p-3 text-right">
                    <button
                      className="text-indigo-600 mr-4"
                      onClick={() =>
                        (window.location.href =
                          `/dashboard/properties/all-units?property=${p._id}`)
                      }
                    >
                      View Units
                    </button>

                    <button
                      className="text-purple-600 mr-4"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Property" onClose={() => setShowAdd(false)}>
          <PropertyForm
            data={newProp}
            setData={setNewProp}
            onSubmit={handleAdd}
          />
        </Modal>
      )}

      {showEdit && editProp && (
        <Modal title="Edit Property" onClose={() => setShowEdit(false)}>
          <PropertyForm
            data={editProp}
            setData={setEditProp}
            onSubmit={handleEdit}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Modal + Form ---------------- */

type PropertyFormData = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

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
      <div className="bg-white p-6 rounded-xl w-[420px]">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button className="mt-4 text-gray-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function PropertyForm<T extends PropertyFormData>({
  data,
  setData,
  onSubmit,
}: {
  data: T;
  setData: (v: T) => void;
  onSubmit: () => void;
}) {
  const isFormValid =
    data.name.trim().length > 0 &&
    data.address.trim().length > 0 &&
    data.city.trim().length > 0 &&
    data.postalCode.trim().length > 0;

  return (
    <>
      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Property Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Address"
        value={data.address}
        onChange={(e) => setData({ ...data, address: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="City"
        value={data.city}
        onChange={(e) => setData({ ...data, city: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Postal Code"
        value={data.postalCode}
        onChange={(e) =>
          setData({ ...data, postalCode: e.target.value })
        }
      />

      <button
        type="button"
        disabled={!isFormValid}
        className={`w-full p-2 rounded mt-2 ${
          isFormValid
            ? "bg-indigo-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={onSubmit}
      >
        Save
      </button>
    </>
  );
}

