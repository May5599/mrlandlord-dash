"use client";

import Link from "next/link";
import {
  Home,
  Building2,
  Users,
  Wrench,
  Wallet,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Tenants", href: "/dashboard/tenants", icon: Users },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Payments", href: "/dashboard/payments", icon: Wallet },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#1e1b4b] text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 text-2xl font-semibold border-b border-white/10">
        MrLandlord
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
          >
            <Icon size={18} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-sm flex items-center gap-2">
        <LogOut size={16} />
        Logout
      </div>
    </aside>
  );
}
