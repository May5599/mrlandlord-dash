"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { useState, useMemo } from "react";
import PropertiesNav from "../PropertiesNav";

/* -------------------- Types -------------------- */

type BulkActionType =
  | "increase_value"
  | "increase_percent"
  | "decrease_value"
  | "decrease_percent";

export default function QuickUpdatePage() {
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];

  const updateUnit = useMutation(api.units.updateUnit);

  /* -------------------- Form State -------------------- */

  const [selectedProperty, setSelectedProperty] = useState<Id<"properties"> | "all">("all");
  const [selectedType, setSelectedType] = useState("all");
  const [action, setAction] = useState<BulkActionType>("increase_value");
  const [amount, setAmount] = useState("");

  /* -------------------- Filtered Units -------------------- */

  const affectedUnits = useMemo(() => {
    return units
      .filter((u) => selectedProperty === "all" || u.propertyId === selectedProperty)
      .filter((u) => selectedType === "all" || u.type === selectedType);
  }, [units, selectedProperty, selectedType]);

  /* -------------------- Rent Calculation -------------------- */

  const preview = affectedUnits.map((u) => {
    const amt = Number(amount) || 0;
    let newRent = u.baseRent;

    switch (action) {
      case "increase_value":
        newRent = u.baseRent + amt;
        break;
      case "increase_percent":
        newRent = Math.round(u.baseRent * (1 + amt / 100));
        break;
      case "decrease_value":
        newRent = Math.max(0, u.baseRent - amt); // never below zero
        break;
      case "decrease_percent":
        newRent = Math.max(0, Math.round(u.baseRent * (1 - amt / 100)));
        break;
    }

    return {
      ...u,
      newRent,
    };
  });

  /* -------------------- Apply Update -------------------- */

  const [isUpdating, setIsUpdating] = useState(false);

  const applyUpdate = async () => {
    if (!amount) return alert("Enter an amount first");
    if (preview.length === 0) return alert("No units match this filter");

    setIsUpdating(true);

    for (const item of preview) {
      await updateUnit({
        id: item._id,
        updates: { baseRent: item.newRent },
      });
    }

    setIsUpdating(false);
    alert("Updated successfully!");
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Quick Rent Update</h1>
      <p className="text-gray-500 mb-6">
        Bulk update unit rents based on property, unit type, and action.
      </p>

      <PropertiesNav />

      {/* -------------------- Controls -------------------- */}

      <div className="bg-white p-6 border rounded-xl shadow-sm mb-8 grid grid-cols-3 gap-6">
        {/* Property */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Property</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedProperty}
            onChange={(e) =>
              setSelectedProperty((e.target.value as Id<"properties">) || "all")
            }
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Unit Type</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {Array.from(new Set(units.map((u) => u.type))).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Action */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Action</label>
          <select
            className="border p-2 rounded w-full"
            value={action}
            onChange={(e) => setAction(e.target.value as BulkActionType)}
          >
            <option value="increase_value">Increase by Value</option>
            <option value="increase_percent">Increase by Percent</option>
            <option value="decrease_value">Decrease by Value</option>
            <option value="decrease_percent">Decrease by Percent</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-600 mb-1 mt-3">Amount</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Enter value"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      {/* -------------------- Preview Table -------------------- */}

      <div className="bg-white border rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">Preview Updates</h2>

        {preview.length === 0 ? (
          <p className="text-gray-400 p-4">No units match your filter.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-2">Unit</th>
                <th className="p-2">Property</th>
                <th className="p-2">Old Rent</th>
                <th className="p-2">New Rent</th>
              </tr>
            </thead>

            <tbody>
              {preview.map((u) => {
                const p = properties.find((x) => x._id === u.propertyId);
                return (
                  <tr key={u._id} className="border-b">
                    <td className="p-2">{u.unitNumber}</td>
                    <td className="p-2">{p?.name}</td>
                    <td className="p-2">${u.baseRent}</td>
                    <td className="p-2 font-semibold text-indigo-600">${u.newRent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Apply */}
        {preview.length > 0 && (
          <button
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg"
            onClick={applyUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : `Apply to ${preview.length} Units`}
          </button>
        )}
      </div>
    </div>
  );
}
