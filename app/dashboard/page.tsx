

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const COLORS = ["#6366f1", "#10b981", "#fbbf24", "#ef4444"];

export default function DashboardPage() {
  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find(c => c.startsWith("company_admin_token="))
          ?.split("=")[1]
      : undefined;

  const data = useQuery(
    api.dashboard.getCompanyDashboardStats,
    token ? { token } : "skip"
  );

  if (!data) {
    return <div>Loading dashboard...</div>;
  }

  const { summary, charts } = data;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          Company Overview
        </h1>
        <p className="text-gray-600">
          Live operational insights for your properties
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { title: "Properties", value: summary.totalProperties },
          { title: "Units", value: summary.totalUnits },
          { title: "Occupied", value: summary.occupiedUnits },
          { title: "Vacant", value: summary.vacantUnits },
          { title: "Maintenance Units", value: summary.maintenanceUnits },
          { title: "Open Requests", value: summary.openMaintenance },
        ].map(card => (
          <div
            key={card.title}
            className="bg-white p-5 rounded-xl border shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-3xl font-semibold text-indigo-600 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Maintenance Trend */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">
            Maintenance Requests (This Year)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.monthlyMaintenance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Overview */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">
            Occupancy Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.occupancy}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {charts.occupancy.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance by Status */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">
            Maintenance by Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.maintenanceByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance by Category */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">
            Maintenance by Category
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.maintenanceByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
