// // import crypto from "crypto";

// import { mutation } from "./_generated/server";
// import { v } from "convex/values";
// // import bcrypt from "bcryptjs";

// // export const tenantLogin = mutation({
// //   args: {
// //     email: v.string(),
// //     password: v.string(),
// //   },

// //   handler: async (ctx, args) => {
// //     const tenant = await ctx.db
// //       .query("tenants")
// //       .withIndex("by_email", (q) => q.eq("email", args.email))
// //       .first();

// //     if (!tenant) {
// //       return { success: false, message: "Tenant not found" };
// //     }

// //     // 1. Check temp password
// //     if (tenant.tempPasswordHash) {
// //       const tempMatch = await bcrypt.compare(
// //         args.password,
// //         tenant.tempPasswordHash
// //       );
// //       if (tempMatch) {
// //         // login success
// //       } else {
// //         // fallback to real password check
// //         if (!tenant.passwordHash) {
// //           return { success: false, message: "Incorrect password" };
// //         }
// //       }
// //     }

// //     // 2. Check real password if exists
// //     if (tenant.passwordHash) {
// //       const realMatch = await bcrypt.compare(
// //         args.password,
// //         tenant.passwordHash
// //       );
// //       if (!realMatch) {
// //         return { success: false, message: "Incorrect password" };
// //       }
// //     }

// //     // 3. Create session token
// //     const token = crypto.randomUUID();
// //     const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

// //     await ctx.db.insert("tenantSessions", {
// //       tenantId: tenant._id,
// //       token,
// //       expiresAt,
// //     });

// //     return {
// //       success: true,
// //       tenantId: tenant._id,
// //       token,
// //       onboardingStatus: tenant.onboardingStatus || "pending_setup",
// //     };
// //   },
// // });
// export const tenantLoginRaw = mutation({
//   args: {
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const tenant = await ctx.db
//       .query("tenants")
//       .withIndex("by_email", (q) => q.eq("email", args.email))
//       .first();

//     if (!tenant) {
//       return { success: false, message: "Tenant not found" };
//     }

//     return { success: true, tenant };
//   },
// });

// import { mutation } from "./_generated/server";
// import { v } from "convex/values";

// export const tenantLoginRaw = mutation({
//   args: {
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const tenant = await ctx.db
//       .query("tenants")
//       .withIndex("by_email", (q) => q.eq("email", args.email))
//       .first();

//     if (!tenant) {
//       return { success: false, message: "Tenant not found" };
//     }

//     return { success: true, tenant };
//   },
// });


// import { mutation } from "./_generated/server";
// import { v } from "convex/values";

// /**
//  * Tenant login using email only
//  * Must verify tenant belongs to the same company as the manager system
//  */
// export const tenantLoginRaw = mutation({
//   args: {
//     email: v.string(),
//   },

//   handler: async (ctx, { email }) => {
//     // Get company of the domain/app tenant is logging into
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const companyId = identity.subject;  // same as manager tenant-company root identity

//     // Look up tenant by email
//     const tenant = await ctx.db
//       .query("tenants")
//       .withIndex("by_email", (q) => q.eq("email", email))
//       .filter((q) => q.eq(q.field("companyId"), companyId)) // 🔥 ensure company match
//       .first();

//     if (!tenant) {
//       return { success: false, message: "Tenant not found or not part of this company" };
//     }

//     return { success: true, tenant };
//   },
// });



import { mutation } from "./_generated/server";
import { v } from "convex/values";

// DEV MODE COMPANY ID
async function getCompanyId(ctx: any) {
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}

/**
 * Tenant login using email only
 */
export const tenantLoginRaw = mutation({
  args: { email: v.string() },

  handler: async (ctx, { email }) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .first();

    if (!tenant)
      return { success: false, message: "Tenant not found for this company" };

    return { success: true, tenant };
  },
});
