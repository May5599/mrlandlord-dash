import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
  }

  try {
    await fetchMutation(api.tenantsAuth.resetPassword, { token, newPassword });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Invalid or expired token" }, { status: 400 });
  }
}
