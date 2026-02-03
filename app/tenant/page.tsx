"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TenantSession = {
  valid: boolean;
  token: string;
  tenant?: {
    name?: string;
  };
};

export default function TenantHomePage() {
  const router = useRouter();
  const [session, setSession] = useState<TenantSession | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });

      const data = await res.json();

      if (!data.valid) {
        router.push("/tenant/login");
        return;
      }

      setSession(data);
    }

    load();
  }, [router]);

  if (!session) return <p className="p-8">Loading...</p>;

  const tenantName = session.tenant?.name ?? "";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* DASHBOARD HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-10 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold">
            Welcome{tenantName ? `, ${tenantName}` : ""}
          </h1>

          <p className="mt-2 text-indigo-100 max-w-xl">
            Your tenant dashboard. Manage maintenance requests and stay updated
            on work happening in your unit.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push("/tenant/maintenance")}
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium shadow hover:bg-indigo-50 transition"
            >
              Open Dashboard
            </button>
          </div>
        </div>

        {/* subtle background decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
