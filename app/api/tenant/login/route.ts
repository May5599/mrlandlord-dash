import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // -------------------------------------------
  // Step 1: Fetch tenant record
  // -------------------------------------------
  const result = await fetchMutation(api.tenantsAuth.tenantLoginRaw, { email });

  if (!result.success || !result.tenant) {
    return NextResponse.json(
      { success: false, message: "Tenant not found" },
      { status: 401 }
    );
  }

  const tenant = result.tenant;

  // -------------------------------------------
  // Step 2: Choose the hash to compare
  // -------------------------------------------
  const hashToCompare = tenant.passwordHash || tenant.tempPasswordHash;

  if (!hashToCompare) {
    return NextResponse.json(
      { success: false, message: "No password set for this tenant" },
      { status: 401 }
    );
  }

  // -------------------------------------------
  // Step 3: Validate password
  // -------------------------------------------
  const match = await bcrypt.compare(password, hashToCompare);

  if (!match) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 }
    );
  }

  // -------------------------------------------
  // Step 4: Create secure session token
  // -------------------------------------------
  // const token = crypto.randomUUID();

  // // ⭐ IMPORTANT: Save session in Convex
  // await fetchMutation(api.tenantSessions.createSession, {
  //   tenantId: tenant._id,
  //   token,
  // });

  // // -------------------------------------------
  // // Step 5: Prepare response
  // // -------------------------------------------
  // const response = NextResponse.json({
  //   success: true,
  //   tenantId: tenant._id,
  //   token,
  // });

  // // -------------------------------------------
  // // Step 6: Set cookie
  // // -------------------------------------------
  // response.cookies.set("tenant_session", token, {
  //   httpOnly: true,
  //   secure: false,          // true on production
  //   sameSite: "lax",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 7,
  // });

  // return response;
  // Step 4: Create secure session token
const token = crypto.randomUUID();

// ⭐ IMPORTANT: save the session in Convex
await fetchMutation(api.tenantSessions.createSession, {
  tenantId: tenant._id,
  token,
});

const response = NextResponse.json({
  success: true,
  token,
  tenantId: tenant._id,
  onboardingStatus: tenant.onboardingStatus || "pending_setup",
});

// Set cookie
response.cookies.set("tenant_session", token, {
  httpOnly: true,
  secure: false,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return response;

}
