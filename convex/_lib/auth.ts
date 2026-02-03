import { query } from "../_generated/server";
import { v } from "convex/values";

export async function getCompanyIdFromSession(
  ctx: any,
  token: string
) {
  if (!token) {
    throw new Error("Not authenticated");
  }

  const session = await ctx.db
    .query("companyAdminSessions")
    .withIndex("by_token", q => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Invalid or expired session");
  }

  return session.companyId;
}
