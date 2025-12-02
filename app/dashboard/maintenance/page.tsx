"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "./MaintenanceNav";

export default function MaintenanceOverview() {
  const requests = useQuery(api.maintenance.getAllRequests) ?? [];
  const properties = useQuery(api.properties.getAllProperties) ?? [];

  // --- STATS ---
  const total = requests.length;
  const open = requests.filter((r) => r.status === "open").length;
  const inProgress = requests.filter((r) => r.status === "in-progress").length;
  const completed = requests.filter((r) => r.status === "completed").length;

  const highPriority = requests.filter((r) => r.priority === "high").length;
  const mediumPriority = requests.filter((r) => r.priority === "medium").length;
  const lowPriority = requests.filter((r) => r.priority === "low").length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Maintenance Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Track all property maintenance activity in real time.
      </p>

      <MaintenanceNav />

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Requests" value={total} />
        <StatCard title="Open" value={open} />
        <StatCard title="In Progress" value={inProgress} />
        <StatCard title="Completed" value={completed} />
      </div>

      {/* --- PRIORITY BREAKDOWN --- */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="High Priority" value={highPriority} />
        <StatCard title="Medium Priority" value={mediumPriority} />
        <StatCard title="Low Priority" value={lowPriority} />
      </div>

      {/* --- PLACEHOLDER FOR CHARTS --- */}
      <div className="bg-white p-6 border rounded-xl shadow-sm">
        <h2 className="text-lg font-medium mb-2">Maintenance Insights</h2>
        <p className="text-gray-500">Charts coming soon...</p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Reusable Stat Card
----------------------------------------------------------- */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
