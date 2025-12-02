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
  Legend,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#6366f1", "#a5b4fc", "#fbbf24", "#10b981", "#ef4444"];

const revenueData = [
  { month: "Jul", revenue: 9200 },
  { month: "Aug", revenue: 10800 },
  { month: "Sep", revenue: 12100 },
  { month: "Oct", revenue: 13850 },
  { month: "Nov", revenue: 14920 },
];

const occupancyData = [
  { name: "Occupied Units", value: 78 },
  { name: "Vacant Units", value: 14 },
  { name: "Under Maintenance", value: 8 },
];

const leadSourceData = [
  { name: "Website", leads: 156 },
  { name: "Google Ads", leads: 103 },
  { name: "Referral", leads: 64 },
  { name: "Social Media", leads: 72 },
  { name: "Offline", leads: 42 },
];

const trafficData = [
  { date: "Oct 10", website: 220, ads: 180 },
  { date: "Oct 15", website: 290, ads: 210 },
  { date: "Oct 20", website: 350, ads: 250 },
  { date: "Oct 25", website: 410, ads: 290 },
  { date: "Nov 1", website: 470, ads: 330 },
  { date: "Nov 5", website: 520, ads: 360 },
];

const websiteStats = [
  { title: "Website Leads", value: 48, unit: "Leads" },
  { title: "Advertising Leads", value: 223, unit: "Leads" },
  { title: "Total Leads", value: 271, unit: "Leads" },
  { title: "New Users", value: 1489, unit: "Users" },
  { title: "Website Sessions", value: 2324, unit: "Sessions" },
  { title: "Pageviews", value: 8610, unit: "Views" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Welcome back, Mayank 👋</h1>
        <p className="text-gray-600">
          Monitor your property, lead, and website performance — all updated dynamically.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Properties", value: "11", unit: "Units" },
          { title: "Leads This Month", value: "298", unit: "Leads" },
          { title: "Avg Listing Score", value: "61.18", unit: "%" },
          { title: "Total Revenue", value: "$14,920", unit: "CAD" },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all"
          >
            <h3 className="text-sm text-gray-500">{card.title}</h3>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-semibold text-indigo-600">
                {card.value}
              </p>
              <span className="text-xs text-gray-400 mb-1">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Website Analytics Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Website Analytics (Last 30 Days)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {websiteStats.map((item) => (
            <div
              key={item.title}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all"
            >
              <h4 className="text-sm text-gray-500">{item.title}</h4>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-semibold text-indigo-600">
                  {item.value.toLocaleString()}
                </p>
                <span className="text-xs text-gray-400 mb-1">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue Trend (CAD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()} CAD`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Occupancy Overview (Units)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={occupancyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {occupancyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v} Units`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Lead Sources (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadSourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `${v} Leads`} />
              <Bar dataKey="leads" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Website vs Ads Traffic */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Traffic Comparison (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => `${v} Visits`} />
              <Line
                type="monotone"
                dataKey="website"
                stroke="#6366f1"
                strokeWidth={2}
                name="Website Visits"
              />
              <Line
                type="monotone"
                dataKey="ads"
                stroke="#fbbf24"
                strokeWidth={2}
                name="Ad Clicks"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
