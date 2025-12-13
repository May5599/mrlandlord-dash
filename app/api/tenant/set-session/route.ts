// // import { NextResponse } from "next/server";

// // export async function POST(req: Request) {
// //   const { token } = await req.json();

// //   const res = NextResponse.json(
// //     { success: true },
// //     { status: 200 }
// //   );

// //   res.cookies.set("tenant_session", token, {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === "production",
// //     sameSite: "lax",
// //     path: "/",
// //     maxAge: 60 * 60 * 24 * 7,
// //   });

// //   return res;
// // }
// export async function POST(req: Request) {
//   return Response.json({ ok: true });
// }


import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function GET(req: Request) {
  const token = req.headers.get("x-tenant-token") || "";


  if (!token) {
    return NextResponse.json({ valid: false });
  }

  const session = await fetchQuery(api.tenantSessions.getByToken, { token });

  if (!session) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    tenantId: session.tenantId,
  });
}
