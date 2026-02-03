import { mutation, query } from "./_generated/server"; // ✅ FIX
import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import type { MutationCtx } from "./_generated/server";

/* ------------------ ADMIN CREATION ------------------ */

export const createCompanyAdmin = mutation({
  args: {
    companyId: v.id("companies"),
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("companyAdmins", {
      companyId: args.companyId,
      email: args.email,
      passwordHash: args.passwordHash,
      createdAt: new Date().toISOString(),
    });
  },
});

/* ------------------ LOGIN ------------------ */

export const loginCompanyAdmin = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("companyAdmins")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();

    if (!admin || admin.passwordHash !== args.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const token = uuidv4();

    await ctx.db.insert("companyAdminSessions", {
      adminId: admin._id,
      companyId: admin.companyId,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h
    });

    return { token };
  },
});

/* ------------------ INTERNAL HELPER (MUTATIONS ONLY) ------------------ */

export async function getCompanySession(
  ctx: MutationCtx,
  token: string
) {
  const session = await ctx.db
    .query("companyAdminSessions")
    .withIndex("by_token", q => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session;
}

/* ------------------ FRONTEND QUERY ------------------ */

export const getCurrentSession = query({
  handler: async (ctx) => {
    const session = await ctx.db
      .query("companyAdminSessions")
      .order("desc")
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  },
});


export const verifyCompanyAdmin = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("companyAdminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { allowed: false };
    }

    return {
      allowed: true,
      companyId: session.companyId,
      adminId: session.adminId,
    };
  },
});

export const verifySession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("companyAdminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { allowed: false };
    }

    return {
      allowed: true,
      companyId: session.companyId,
      adminId: session.adminId,
    };
  },
});


export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("companyAdminSessions")
      .withIndex("by_token", q => q.eq("token", token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});
