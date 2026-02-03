"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/ui/sidebar";

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
      const token = document.cookie
        .split("; ")
        .find(c => c.startsWith("company_admin_token="))
        ?.split("=")[1];

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
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
