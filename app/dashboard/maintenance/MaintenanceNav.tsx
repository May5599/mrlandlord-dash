"use client";

import { usePathname } from "next/navigation";

const baseTabs = [
  { name: "Overview", href: "/dashboard/maintenance" },
  { name: "All Requests", href: "/dashboard/maintenance/all" },
  { name: "Property-wise", href: "/dashboard/maintenance/property" },
  { name: "Vendors", href: "/dashboard/maintenance/vendors" },
];

export default function MaintenanceNav() {
  const pathname = usePathname();

  // Clone base tabs
  const tabs = [...baseTabs];

  // Detect if viewing a specific maintenance request
  const pathParts = pathname.split("/");

  const isMaintenanceDetail =
    pathname.startsWith("/dashboard/maintenance/") &&
    pathParts.length === 4 &&
    pathname !== "/dashboard/maintenance" &&
    pathname !== "/dashboard/maintenance/all" &&
    pathname !== "/dashboard/maintenance/property" &&
    pathname !== "/dashboard/maintenance/vendors";

  // Add dynamic tab only when on a request detail page
  if (isMaintenanceDetail && !tabs.some((t) => t.href === pathname)) {
    tabs.push({
      name: "Request Details",
      href: pathname,
    });
  }

  return (
    <div className="flex gap-4 mb-6 border-b pb-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`px-3 py-1 rounded ${
              active
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            {tab.name}
          </a>
        );
      })}
    </div>
  );
}
