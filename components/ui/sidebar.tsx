// "use client";

// import Link from "next/link";
// import {
//   Home,
//   Building2,
//   Users,
//   Wrench,
//   Wallet,
//   BarChart2,
//   Settings,
//   LogOut,
//   Bell,
// } from "lucide-react";

// const navItems = [
//   { name: "Dashboard", href: "/dashboard", icon: Home },
//   { name: "Properties", href: "/dashboard/properties", icon: Building2 },
//   { name: "Tenants", href: "/dashboard/tenants", icon: Users },
//   { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
//   { name: "Vendors", href: "/dashboard/vendors", icon: Wrench  },
//   { name: "Payments", href: "/dashboard/payments", icon: Wallet },
//   { name: "Reports", href: "/dashboard/reports", icon: BarChart2 },
//   { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
//   { name: "Settings", href: "/dashboard/settings", icon: Settings },
// ];

// export function Sidebar() {
//   return (
//     <aside className="w-64 bg-[#1e1b4b] text-white flex flex-col h-screen fixed left-0 top-0">
//       {/* Logo */}
//       <div className="p-6 text-2xl font-semibold border-b border-white/10">
//         MrLandlord
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//         {navItems.map(({ name, href, icon: Icon }) => (
//           <Link
//             key={name}
//             href={href}
//             className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
//           >
//             <Icon size={18} />
//             <span>{name}</span>
//           </Link>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-white/10 text-sm flex items-center gap-2">
//         <LogOut size={16} />
//         Logout
//       </div>
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  Home,
  Building2,
  Users,
  Wrench,
  Wallet,
  BarChart2,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Tenants", href: "/dashboard/tenants", icon: Users },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Vendors", href: "/dashboard/vendors", icon: Wrench },
  { name: "Payments", href: "/dashboard/payments", icon: Wallet },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  // Live unread notifications count
  const unread = useQuery(api.notifications.getUnreadCount, {}) ?? 0;

  return (
    <aside className="w-64 bg-[#1e1b4b] text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 text-2xl font-semibold border-b border-white/10">
        MrLandlord
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isNotifications = name === "Notifications";

          return (
            <Link
              key={name}
              href={href}
              className="relative flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
            >
              <Icon size={18} />
              <span>{name}</span>

              {/* Unread badge */}
              {isNotifications && unread > 0 && (
                <span
                  className="
                    absolute right-3 top-2
                    bg-blue-500 text-white text-xs
                    px-2 py-0.5 rounded-full
                    font-semibold
                  "
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-sm flex items-center gap-2">
        <LogOut size={16} />
        Logout
      </div>
    </aside>
  );
}
