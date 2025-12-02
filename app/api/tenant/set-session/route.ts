// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { token } = await req.json();

//   const res = NextResponse.json(
//     { success: true },
//     { status: 200 }
//   );

//   res.cookies.set("tenant_session", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   });

//   return res;
// }
export async function POST(req: Request) {
  return Response.json({ ok: true });
}
