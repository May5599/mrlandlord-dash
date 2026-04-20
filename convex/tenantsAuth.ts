import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, comparePassword } from "../convex/_lib/password";
import { internal } from "./_generated/api";

/**
 * Tenant login lookup by email
 * Company scoping is handled at session creation
 */
export const tenantLoginRaw = mutation({
  args: {
    email: v.string(),
  },

  handler: async (ctx, { email }) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!tenant) {
      return { success: false };
    }

    return { success: true, tenant };
  },
});

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();

    if (!tenant) return { success: true };

    const resetToken = uuidv4();
    await ctx.db.patch(tenant._id, {
      resetToken,
      resetTokenExpiresAt: Date.now() + 1000 * 60 * 30,
    });

    const resetLink =
      process.env.NEXT_PUBLIC_APP_URL +
      "/tenant/reset-password?token=" +
      resetToken;

    await ctx.scheduler.runAfter(0, internal.emailActions.sendPasswordReset, {
      email: tenant.email,
      name: tenant.name,
      resetLink,
    });

    return { success: true };
  },
});

export const changePassword = mutation({
  args: {
    sessionToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("tenantSessions")
      .withIndex("by_token", q => q.eq("token", args.sessionToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const tenant = await ctx.db.get(session.tenantId);
    if (!tenant) throw new Error("Tenant not found");

    const hashToCompare = tenant.passwordHash || tenant.tempPasswordHash;
    if (!hashToCompare || !comparePassword(args.currentPassword, hashToCompare)) {
      throw new Error("Current password is incorrect");
    }

    await ctx.db.patch(tenant._id, {
      passwordHash: hashPassword(args.newPassword),
      tempPasswordHash: undefined,
    });

    return { success: true };
  },
});

export const resetPassword = mutation({
  args: { token: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .filter(q => q.eq(q.field("resetToken"), args.token))
      .first();

    if (!tenant || !tenant.resetTokenExpiresAt || tenant.resetTokenExpiresAt < Date.now()) {
      throw new Error("Invalid or expired token");
    }

    await ctx.db.patch(tenant._id, {
      passwordHash: hashPassword(args.newPassword),
      tempPasswordHash: undefined,
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
    });

    const sessions = await ctx.db
      .query("tenantSessions")
      .filter(q => q.eq(q.field("tenantId"), tenant._id))
      .collect();
    await Promise.all(sessions.map(s => ctx.db.delete(s._id)));

    return { success: true };
  },
});
