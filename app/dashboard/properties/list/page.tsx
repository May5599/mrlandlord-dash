"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import PropertiesNav from "../PropertiesNav";

export default function PropertyListPage() {
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];

  const createProperty = useMutation(api.properties.createProperty);
  const updateProperty = useMutation(api.properties.updateProperty);
  const deleteProperty = useMutation(api.properties.deleteProperty);

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
    await createProperty({
      name: newProp.name,
      address: newProp.address,
      city: newProp.city,
      postalCode: newProp.postalCode,
      country: newProp.country,
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
  const [editProp, setEditProp] = useState<
  (PropertyFormData & { _id: Id<"properties"> }) | null
>(null);


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
    if (!editProp) return;

    await updateProperty({
      id: editProp._id,
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

  const handleDelete = async (id: Id<"properties">) => {
    if (!confirm("Delete this property?")) return;
    await deleteProperty({ id });
  };

  // -------------------- Helpers --------------------

  const getUnitSummary = (propertyId: Id<"properties">) => {
    const list = units.filter((u) => u.propertyId === propertyId);
    const occupied = list.filter((u) => u.status === "occupied").length;
    const vacant = list.filter((u) => u.status === "vacant").length;
    return { total: list.length, occupied, vacant };
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Property List</h1>
      <p className="text-gray-500 mb-6">View and manage all properties.</p>

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

        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Property
        </button>
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
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{s.total}</td>
                  <td className="p-3 text-green-600">{s.occupied}</td>
                  <td className="p-3 text-blue-600">{s.vacant}</td>

                  <td className="p-3 text-right">
                    <button
                      className="text-indigo-600 mr-4"
                      onClick={() =>
                        (window.location.href = `/dashboard/properties/all-units?property=${p._id}`)
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

      {/* Add Property Modal */}
      {showAdd && (
        <Modal title="Add Property" onClose={() => setShowAdd(false)}>
          <PropertyForm data={newProp} setData={setNewProp} onSubmit={handleAdd} />
        </Modal>
      )}

      {/* Edit Property Modal */}
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

/* ---------------- MODAL ---------------- */

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

/* ---------------- FORM ---------------- */

type PropertyFormData = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

function PropertyForm<T extends PropertyFormData>({
  data,
  setData,
  onSubmit,
}: {
  data: T;
  setData: (v: T) => void;
  onSubmit: () => void;
}) {


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
        className="w-full bg-indigo-600 text-white p-2 rounded mt-2"
        onClick={onSubmit}
      >
        Save
      </button>
    </>
  );
}