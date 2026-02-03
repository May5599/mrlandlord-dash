"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSessionToken() {
  const session = useQuery(api.companyAdmins.getCurrentSession);

  if (!session) return null;

  return session.token;
}
