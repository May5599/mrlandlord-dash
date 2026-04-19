"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/ui/notification-bell";
import { getAdminToken } from "@/lib/getAdminToken";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ DO NOT verify on login page
    if (pathname === "/login") {
      setAllowed(true);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function verify() {
      const token = getAdminToken();

      if (!token) {
        if (mounted) setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const res = await fetchMutation(
          api.companyAdmins.verifySession,
          { token }
        );

        if (!res.allowed) {
          if (mounted) setLoading(false);
          router.push("/login");
          return;
        }

        if (mounted) {
          setAllowed(true);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
        router.push("/login");
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking session...
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Top header with notification bell */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-end shrink-0 shadow-sm">
          <NotificationBell />
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
