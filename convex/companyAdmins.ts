import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import type { MutationCtx } from "./_generated/server";
import { hashPassword, comparePassword } from "../convex/_lib/password";
import { sendPasswordResetEmail } from "./_lib/emailService";

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

    if (!admin || !comparePassword(args.passwordHash, admin.passwordHash)) {
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

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("companyAdmins")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();

    if (!admin) return { success: true };

    const resetToken = uuidv4();
    await ctx.db.patch(admin._id, {
      resetToken,
      resetTokenExpiresAt: Date.now() + 1000 * 60 * 30,
    });

    const resetLink =
      process.env.NEXT_PUBLIC_APP_URL +
      "/reset-password?token=" +
      resetToken;

    try {
      await sendPasswordResetEmail(admin.email, admin.email, resetLink);
    } catch (e) {
      console.error("Failed to send reset email:", e);
    }

    return { success: true };
  },
});

export const resetPassword = mutation({
  args: { token: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("companyAdmins")
      .filter(q => q.eq(q.field("resetToken"), args.token))
      .first();

    if (!admin || !admin.resetTokenExpiresAt || admin.resetTokenExpiresAt < Date.now()) {
      throw new Error("Invalid or expired token");
    }

    await ctx.db.patch(admin._id, {
      passwordHash: hashPassword(args.newPassword),
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
      mustChangePassword: false,
    });

    const sessions = await ctx.db
      .query("companyAdminSessions")
      .filter(q => q.eq(q.field("adminId"), admin._id))
      .collect();
    await Promise.all(sessions.map(s => ctx.db.delete(s._id)));

    return { success: true };
  },
});

export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("companyAdminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const admin = await ctx.db.get(session.adminId);
    if (!admin) throw new Error("Admin not found");

    if (!comparePassword(args.currentPassword, admin.passwordHash)) {
      throw new Error("Current password is incorrect");
    }

    await ctx.db.patch(admin._id, {
      passwordHash: hashPassword(args.newPassword),
      mustChangePassword: false,
    });

    return { success: true };
  },
});
