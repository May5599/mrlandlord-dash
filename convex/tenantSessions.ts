


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
   CREATE TENANT SESSION
------------------------------------------------------ */
export const createSession = mutation({
  args: {
    tenantId: v.id("tenants"),
    companyId: v.id("companies"),
    token: v.string(),
  },

  handler: async (ctx, { tenantId, companyId, token }) => {
    const tenant = await ctx.db.get(tenantId);

    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Invalid tenant");
    }

    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;

    await ctx.db.insert("tenantSessions", {
      tenantId,
      companyId,
      token,
      expiresAt,
    });
  },
});

/* -----------------------------------------------------
   GET SESSION BY TOKEN
------------------------------------------------------ */
export const getByToken = query({
  args: { token: v.string() },

  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("tenantSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    const tenant = await ctx.db.get(session.tenantId);
    if (!tenant || tenant.companyId !== session.companyId) return null;

    return {
      tenantId: tenant._id,
      companyId: tenant.companyId,
      propertyId: tenant.propertyId,
      unitId: tenant.unitId,
    };
  },
});

/* -----------------------------------------------------
   DELETE SESSION
------------------------------------------------------ */
export const deleteSession = mutation({
  args: { token: v.string() },

  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("tenantSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});
