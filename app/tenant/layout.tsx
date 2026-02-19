// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";

// // export default function TenantLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const pathname = usePathname();

// //   // Hide sidebar on login + onboarding pages
// //   const hideSidebar =
// //     pathname === "/tenant/login" ||
// //     pathname.startsWith("/tenant/onboarding");

// //   return (
// //     <div className="min-h-screen flex bg-gray-50">
// //       {/* Sidebar */}
// //       {!hideSidebar && (
// //         <aside className="w-64 bg-white border-r p-6">
// //           <h2 className="text-xl font-semibold mb-6">Tenant Portal</h2>
// //           <nav className="flex flex-col gap-3">
// //             <Link
// //               className="text-gray-700 hover:text-indigo-600"
// //               href="/tenant/dashboard"
// //             >
// //               Dashboard
// //             </Link>
// //             <Link
// //               className="text-gray-700 hover:text-indigo-600"
// //               href="/tenant/profile"
// //             >
// //               Profile
// //             </Link>
// //             <Link
// //               className="text-gray-700 hover:text-indigo-600"
// //               href="/tenant/maintenance"
// //             >
// //               Request Maintenance
// //             </Link>
// //             <Link
// //               className="text-gray-700 hover:text-indigo-600"
// //               href="/tenant/payments"
// //             >
// //               Payments
// //             </Link>
// //             <Link
// //               className="text-gray-700 hover:text-indigo-600"
// //               href="/tenant/documents"
// //             >
// //               Documents
// //             </Link>
// //           </nav>
// //         </aside>
// //       )}

// //       {/* Main Content */}
// //       <main className={`flex-1 p-10 ${hideSidebar ? "max-w-3xl mx-auto" : ""}`}>
// //         {children}
// //       </main>
// //     </div>
// //   );
// // }


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function TenantLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();

//   // Hide sidebar on login + onboarding pages
//   const hideSidebar =
//     pathname === "/tenant/login" ||
//     pathname.startsWith("/tenant/onboarding");

//   return (
//     <div className="min-h-screen flex bg-gray-50">
      
//       {/* Sidebar */}
//       {!hideSidebar && (
//         <aside className="w-64 bg-white border-r p-6">
//           <h2 className="text-xl font-semibold mb-6">
//             Tenant Portal
//           </h2>

//           <nav className="flex flex-col gap-3">
//             <Link
//               className="text-gray-700 hover:text-indigo-600"
//               href="/tenant/dashboard"
//             >
//               Dashboard
//             </Link>

//             <Link
//               className="text-gray-700 hover:text-indigo-600"
//               href="/tenant/profile"
//             >
//               Profile
//             </Link>

//             <Link
//               className="text-gray-700 hover:text-indigo-600"
//               href="/tenant/maintenance"
//             >
//               Request Maintenance
//             </Link>

//             <Link
//               className="text-gray-700 hover:text-indigo-600"
//               href="/tenant/payments"
//             >
//               Payments
//             </Link>

//             <Link
//               className="text-gray-700 hover:text-indigo-600"
//               href="/tenant/documents"
//             >
//               Documents
//             </Link>
//           </nav>
//         </aside>
//       )}

//       {/* Main Content */}
//       <main
//         className={`flex-1 ${
//           hideSidebar ? "p-0" : "p-10"
//         }`}
//       >
//         {children}
//       </main>

//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/tenant/login" ||
    pathname.startsWith("/tenant/onboarding");

  const navItems = [
    { label: "Dashboard", href: "/tenant/dashboard" },
    { label: "Profile", href: "/tenant/profile" },
    { label: "Maintenance", href: "/tenant/maintenance" },
    { label: "Payments", href: "/tenant/payments" },
    { label: "Documents", href: "/tenant/documents" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      {!hideSidebar && (
        <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col">

          {/* Brand Section */}
          <div className="px-6 py-6 border-b border-gray-100">
            <img
              src="/Mrlandlord.ca_FAW .svg"
              alt="MrLandlord Logo"
              className="h-10 w-auto mb-3"
            />
            <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
              Tenant Portal
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={async () => {
                await fetch("/api/tenant/logout", { method: "POST" });
                window.location.href = "/";
              }}
              className="w-full text-sm text-red-600 hover:underline text-left"
            >
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 ${
          hideSidebar ? "p-0" : "p-10"
        }`}
      >
        {children}
      </main>

    </div>
  );
}
