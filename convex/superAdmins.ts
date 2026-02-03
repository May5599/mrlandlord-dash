import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { v4 as uuid } from "uuid";

export const login = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("superAdmins")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();

    if (!admin || admin.passwordHash !== args.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const token = uuid();

    await ctx.db.insert("superAdminSessions", {
      adminId: admin._id,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h
    });

    return { token };
  },
});


export const verify = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { allowed: false };
    }

    return { allowed: true };
  },
});


export const createCompanyWithAdmin = mutation({
  args: {
    superAdminToken: v.string(),

    companyName: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. verify super admin
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", q => q.eq("token", args.superAdminToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    // 2. create company
    const companyId = await ctx.db.insert("companies", {
      name: args.companyName,
      managerName: args.adminName,
      managerEmail: args.adminEmail,
      createdAt: new Date().toISOString(),
    });

    // 3. create company admin
    await ctx.db.insert("companyAdmins", {
      companyId,
      email: args.adminEmail,
      passwordHash: args.passwordHash,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});


export const getAllCompanies = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("companies").order("desc").collect();
  },
});


export const seedSuperAdmin = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    // prevent duplicates
    const existing = await ctx.db
      .query("superAdmins")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Super admin already exists");
    }

    await ctx.db.insert("superAdmins", {
      email: args.email,
      passwordHash: args.passwordHash,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});
