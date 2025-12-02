"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import PropertiesNav from "./PropertiesNav";


import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function PropertiesOverview() {
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];

  // Stats
  const totalProperties = properties.length;
  const occupiedUnits = units.filter((u) => u.status === "occupied").length;
  const vacantUnits = units.filter((u) => u.status === "vacant").length;
  const maintenanceUnits = units.filter((u) => u.status === "maintenance").length;

  const avgRent =
    units.length > 0
      ? Math.round(units.reduce((s, u) => s + u.baseRent, 0) / units.length)
      : 0;

  const listingScore = 82;

  // Add Property
  const createProperty = useMutation(api.properties.createProperty);
  const [showModal, setShowModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Canada",
  });

  const handleCreate = async () => {
    await createProperty({
      ...newProperty,
    });
    setShowModal(false);
    setNewProperty({ name: "", address: "", city: "", postalCode: "", country: "Canada" });
  };

  // ---------------------- CHART DATA ----------------------

  const occupancyData = [
    { name: "Occupied", value: occupiedUnits },
    { name: "Vacant", value: vacantUnits },
    { name: "Maintenance", value: maintenanceUnits },
  ];

  const rentComparison = [
    { label: "Average", value: avgRent },
    {
      label: "Highest",
      value: units.length > 0 ? Math.max(...units.map((u) => u.baseRent)) : 0,
    },
    {
      label: "Lowest",
      value: units.length > 0 ? Math.min(...units.map((u) => u.baseRent)) : 0,
    },
  ];

  const statusTrend = [
    { name: "Occupied", count: occupiedUnits },
    { name: "Vacant", count: vacantUnits },
    { name: "Maintenance", count: maintenanceUnits },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Properties Overview</h1>
          <p className="text-gray-500">
            Track performance, occupancy, and rent trends across your portfolio.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm"
        >
          + Add Property
        </button>
      </div>

        {/* NEW NAVBAR */}
  <PropertiesNav />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Properties" value={totalProperties} unit="Units" />
        <StatCard title="Occupied Units" value={occupiedUnits} unit="Units" />
        <StatCard title="Vacant Units" value={vacantUnits} unit="Units" />
        <StatCard title="Under Maintenance" value={maintenanceUnits} unit="Units" />
        <StatCard title="Avg Monthly Rent" value={`$${avgRent}`} unit="CAD" />
        <StatCard title="Avg Listing Score" value={`${listingScore}%`} unit="" />
      </div>

      {/* ===================== CHART SECTION ===================== */}

      <div className="grid grid-cols-2 gap-8">

        {/* 1. OCCUPANCY PIE CHART */}
        <div className="p-6 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold mb-4">Occupancy Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={occupancyData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill="#6366f1" />
                <Cell fill="#22c55e" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. RENT BAR CHART */}
        <div className="p-6 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold mb-4">Monthly Rent by Unit</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={units}>
              <XAxis dataKey="unitNumber" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="baseRent" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. LINE CHART - STATUS TREND */}
        <div className="p-6 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold mb-4">Unit Status Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statusTrend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4. RENT COMPARISON */}
        <div className="p-6 border rounded-xl bg-white">
          <h2 className="text-lg font-semibold mb-4">Rent Comparison</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rentComparison}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="value" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Add Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[420px]">
            <h2 className="text-xl font-semibold mb-4">Add Property</h2>

            <input
              placeholder="Property Name"
              className="w-full border p-2 rounded mb-3"
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
            />

            <input
              placeholder="Address"
              className="w-full border p-2 rounded mb-3"
              value={newProperty.address}
              onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
            />

            <input
              placeholder="City"
              className="w-full border p-2 rounded mb-3"
              value={newProperty.city}
              onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
            />

            <input
              placeholder="Postal Code"
              className="w-full border p-2 rounded mb-3"
              value={newProperty.postalCode}
              onChange={(e) => setNewProperty({ ...newProperty, postalCode: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={handleCreate}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number | string;
  unit?: string;
};

function StatCard({ title, value, unit }: StatCardProps) {
  return (
    <div className="p-5 bg-white shadow-sm border rounded-xl">
      <p className="text-gray-600 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">
        {value} <span className="text-sm font-medium text-gray-400">{unit}</span>
      </h3>
    </div>
  );
}
