// import { v } from "convex/values";
// import { query } from "../_generated/server";

// // convex/_lib/getCompanyFromToken.ts

// export async function getCompanyIdFromToken(ctx: any, token: string) {
//   const session = await ctx.db
//     .query("companyAdminSessions")
//     .withIndex("by_token", (q) => q.eq("token", token))
//     .first();

//   if (!session) {
//     throw new Error("Unauthorized");
//   }

//   if (session.expiresAt < Date.now()) {
//     throw new Error("Session expired");
//   }

//   return session.companyId;
// }
import { DatabaseReader } from "../_generated/server";

export async function getCompanyIdFromToken(
  ctx: { db: DatabaseReader },
  token: string
) {
  const session = await ctx.db
    .query("companyAdminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("UNAUTHORIZED");
  }

  return session.companyId;
}
