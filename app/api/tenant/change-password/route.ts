import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("tenant_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
  }

  try {
    await fetchMutation(api.tenantsAuth.changePassword, {
      sessionToken,
      currentPassword,
      newPassword,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to change password" }, { status: 400 });
  }
}
