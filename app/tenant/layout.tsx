"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide sidebar on login + onboarding pages
  const hideSidebar =
    pathname === "/tenant/login" ||
    pathname.startsWith("/tenant/onboarding");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      {!hideSidebar && (
        <aside className="w-64 bg-white border-r p-6">
          <h2 className="text-xl font-semibold mb-6">Tenant Portal</h2>
          <nav className="flex flex-col gap-3">
            <Link
              className="text-gray-700 hover:text-indigo-600"
              href="/tenant/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-gray-700 hover:text-indigo-600"
              href="/tenant/profile"
            >
              Profile
            </Link>
            <Link
              className="text-gray-700 hover:text-indigo-600"
              href="/tenant/maintenance"
            >
              Request Maintenance
            </Link>
            <Link
              className="text-gray-700 hover:text-indigo-600"
              href="/tenant/payments"
            >
              Payments
            </Link>
            <Link
              className="text-gray-700 hover:text-indigo-600"
              href="/tenant/documents"
            >
              Documents
            </Link>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-10 ${hideSidebar ? "max-w-3xl mx-auto" : ""}`}>
        {children}
      </main>
    </div>
  );
}
