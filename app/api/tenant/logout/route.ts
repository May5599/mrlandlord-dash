import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  // No cookies? Not logged in.
  if (!cookieHeader) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("tenant_session", "", {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  // Extract session token
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("tenant_session="))
    ?.split("=")[1];

  if (token) {
    // Remove session from Convex (optional but cleaner)
    await fetchMutation(api.tenantSessions.deleteSession, { token });
  }

  // Delete cookie
  const response = NextResponse.json({ success: true });

  response.cookies.set("tenant_session", "", {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 0,
  });

  return response;
}
