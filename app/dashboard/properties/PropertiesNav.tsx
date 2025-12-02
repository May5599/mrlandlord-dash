"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", href: "/dashboard/properties" },
  { name: "All Units", href: "/dashboard/properties/all-units" },
  { name: "Property List", href: "/dashboard/properties/list" },
  { name: "Quick Update", href: "/dashboard/properties/quick-update" },
  { name: "Rent & Availability", href: "/dashboard/properties/rent" },
  { name: "Contact Info", href: "/dashboard/properties/contact" },
  { name: "Listing Score", href: "/dashboard/properties/score" },
];

export default function PropertiesNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b mb-6">
      <nav className="flex gap-6 overflow-x-auto py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`pb-2 text-sm font-medium ${
                isActive
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

