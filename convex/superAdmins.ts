import {
  notifyCompanyAdmin,
  notifySuperAdmin,
} from "./services/notificationService";
import { sendEmail } from "./_lib/email";

import { generatePassword } from "../lib/generatePassword";
// import { sendLoginEmail } from "../lib/email";
import { hashPassword } from "../convex/_lib/password";
import { comparePassword } from "../convex/_lib/password";



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
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

   if (!admin) {
  throw new Error("Invalid credentials");
}

if (admin.isActive === false) {
  throw new Error("Account disabled");
}

const passwordValid = comparePassword(
  args.passwordHash,
  admin.passwordHash
);

if (!passwordValid) {
  throw new Error("Invalid credentials");
}


    const token = uuid();

    await ctx.db.insert("superAdminSessions", {
      adminId: admin._id,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    });

   return {
  token,
  mustChangePassword:
    admin.mustChangePassword ?? false,
};

  },
});


export const verify = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { allowed: false };
    }

    const admin = await ctx.db.get(session.adminId);

    if (!admin) {
      return { allowed: false };
    }

    return {
      allowed: true,
      role: admin.role,
    };
  },
});

export const createCompanyWithAdmin = mutation({
  args: {
    superAdminToken: v.string(),
    companyName: v.string(),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) =>
        q.eq("token", args.superAdminToken)
      )
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const currentAdmin = await ctx.db.get(session.adminId);

    if (!currentAdmin || currentAdmin.role !== "super_admin") {
      throw new Error("Only super admin can create companies");
    }

    const generatedPassword = generatePassword();

    const hashedPassword = hashPassword(
      generatedPassword
    );

    const companyId = await ctx.db.insert("companies", {
      name: args.companyName,
      managerName: args.adminName,
      managerEmail: args.adminEmail,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.insert("companyAdmins", {
      companyId,
      email: args.adminEmail,
      passwordHash: hashedPassword,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    });

  await notifyCompanyAdmin(ctx, {
  companyId,
  subject: `Welcome to MrLandlord – ${args.companyName}`,
  html: `
    <h2>${args.companyName} Admin Access</h2>
    <p>Your company account has been created.</p>
    <p><strong>Email:</strong> ${args.adminEmail}</p>
    <p><strong>Password:</strong> ${generatedPassword}</p>
    <p>Please login and change your password immediately.</p>
  `,
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
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("companies")
      .order("desc")
      .collect();
  },
});

// export const seedSuperAdmin = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),
//     passwordHash: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const existing = await ctx.db
//       .query("superAdmins")
//       .withIndex("by_email", (q) => q.eq("email", args.email))
//       .first();

//     if (existing) {
//       throw new Error("Super admin already exists");
//     }

//     await ctx.db.insert("superAdmins", {
//       name: args.name,
//       email: args.email,
//       passwordHash: args.passwordHash,
//       role: "super_admin",
//       isActive: true,
//       createdAt: new Date().toISOString(),
//     });

//     return { success: true };
//   },
// });
export const seedSuperAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("superAdmins")
      .withIndex("by_email", (q) =>
        q.eq("email", args.email)
      )
      .first();

    if (existing) {
      throw new Error("Super admin already exists");
    }

    const hashedPassword = hashPassword(
      args.passwordHash
    );

    await ctx.db.insert("superAdmins", {
      name: args.name,
      email: args.email,
      passwordHash: hashedPassword,
      role: "super_admin",
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const getAllSuperAdmins = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const caller = await ctx.db.get(session.adminId);

    if (!caller || caller.role !== "super_admin") {
      throw new Error("Forbidden");
    }

    return await ctx.db.query("superAdmins").collect();
  },
});

export const createSuperAdminUser = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) =>
        q.eq("token", args.token)
      )
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const caller = await ctx.db.get(session.adminId);

    if (!caller || caller.role !== "super_admin") {
      throw new Error("Forbidden");
    }

    const existing = await ctx.db
      .query("superAdmins")
      .withIndex("by_email", (q) =>
        q.eq("email", args.email)
      )
      .first();

    if (existing) {
      throw new Error("Admin already exists");
    }

    const generatedPassword = generatePassword();

    const hashedPassword = hashPassword(
      generatedPassword
    );

    await ctx.db.insert("superAdmins", {
      name: args.name,
      email: args.email,
      passwordHash: hashedPassword,
      role: args.role,
      isActive: true,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    });

    try {
      await notifySuperAdmin(ctx, {
  subject: "MrLandlord Admin Access",
  html: `
    <h2>Admin Account Created</h2>
    <p>You have been granted ${args.role} access.</p>
    <p><strong>Email:</strong> ${args.email}</p>
    <p><strong>Password:</strong> ${generatedPassword}</p>
    <p>Please login and change your password immediately.</p>
  `,
});

    } catch {
      // Do not fail creation if email fails
    }

    return { success: true };
  },
});



export const updateSuperAdminRole = mutation({
  args: {
    token: v.string(),
    adminId: v.id("superAdmins"),
    role: v.union(
      v.literal("super_admin"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const caller = await ctx.db.get(session.adminId);

    if (!caller || caller.role !== "super_admin") {
      throw new Error("Forbidden");
    }

    if (caller._id === args.adminId) {
      throw new Error("Cannot change your own role");
    }

    await ctx.db.patch(args.adminId, {
      role: args.role,
    });

    return { success: true };
  },
});


export const toggleSuperAdminStatus = mutation({
  args: {
    token: v.string(),
    adminId: v.id("superAdmins"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const caller = await ctx.db.get(session.adminId);

    if (!caller || caller.role !== "super_admin") {
      throw new Error("Forbidden");
    }

    if (caller._id === args.adminId) {
      throw new Error("Cannot disable yourself");
    }

    const target = await ctx.db.get(args.adminId);

    if (!target) {
      throw new Error("Admin not found");
    }

    await ctx.db.patch(args.adminId, {
      isActive: !target.isActive,
    });

    return { success: true };
  },
});


export const deleteSuperAdmin = mutation({
  args: {
    token: v.string(),
    adminId: v.id("superAdmins"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("superAdminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const caller = await ctx.db.get(session.adminId);

    if (!caller || caller.role !== "super_admin") {
      throw new Error("Forbidden");
    }

    if (caller._id === args.adminId) {
      throw new Error("Cannot delete yourself");
    }

    const allAdmins = await ctx.db.query("superAdmins").collect();

    const superAdminCount = allAdmins.filter(
      (a) => a.role === "super_admin"
    ).length;

    const target = await ctx.db.get(args.adminId);

    if (!target) {
      throw new Error("Admin not found");
    }

    if (
      target.role === "super_admin" &&
      superAdminCount <= 1
    ) {
      throw new Error("Cannot remove last super admin");
    }

    await ctx.db.delete(args.adminId);

    return { success: true };
  },
});


export const requestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("superAdmins")
      .withIndex("by_email", (q) =>
        q.eq("email", args.email)
      )
      .first();

    if (!admin) {
      return { success: true };
    }

    const resetToken = uuid();

    await ctx.db.patch(admin._id, {
      resetToken,
      resetTokenExpiresAt:
        Date.now() + 1000 * 60 * 30,
    });

    const resetLink =
      process.env.NEXT_PUBLIC_APP_URL +
      "/admin/reset-password?token=" +
      resetToken;



    try {
      await sendEmail({
  to: admin.email,
  subject: "Password Reset Request",
  html: `
    <h3>Password Reset</h3>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link expires in 30 minutes.</p>
  `,
});




    } catch {}

    return { success: true };
  },
});


export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("superAdmins")
      .filter((q) =>
        q.eq(q.field("resetToken"), args.token)
      )
      .first();

    if (
      !admin ||
      !admin.resetTokenExpiresAt ||
      admin.resetTokenExpiresAt < Date.now()
    ) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = hashPassword(
      args.newPassword
    );

    await ctx.db.patch(admin._id, {
      passwordHash: hashedPassword,
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
      mustChangePassword: false,
    });

    const sessions = await ctx.db
      .query("superAdminSessions")
      .filter((q) =>
        q.eq(q.field("adminId"), admin._id)
      )
      .collect();

    await Promise.all(
      sessions.map((s) =>
        ctx.db.delete(s._id)
      )
    );

    return { success: true };
  },
});
