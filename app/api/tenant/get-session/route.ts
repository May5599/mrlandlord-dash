import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";


export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) {
    return NextResponse.json({ valid: false });
  }

  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("tenant_session="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ valid: false });
  }

  let session;
  try {
    session = await fetchQuery(api.tenantSessions.getByToken, { token });
  } catch (err) {
    console.log("SESSION ERROR:", err);
    return NextResponse.json({ valid: false });
  }

  if (!session) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    tenantId: session.tenantId,
      propertyId: session.propertyId,
  unitId: session.unitId,

  });
}
