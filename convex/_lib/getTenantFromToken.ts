import { DatabaseReader } from "../_generated/server";

export async function getTenantFromToken(
  ctx: { db: DatabaseReader },
  token: string
) {
  const session = await ctx.db
    .query("tenantSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("UNAUTHORIZED");
  }

  const tenant = await ctx.db.get(session.tenantId);
  if (!tenant || tenant.companyId !== session.companyId) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    tenant,
    tenantId: tenant._id,
    companyId: tenant.companyId,
  };
}
