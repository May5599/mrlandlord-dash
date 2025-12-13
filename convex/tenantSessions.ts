// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const writeSession = mutation({
//   args: {
//     tenantId: v.id("tenants"),
//     token: v.string(),
//     expiresAt: v.number(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("tenantSessions", args);
//   },
// });

// export const validateSession = query({
//   args: { token: v.string() },
//   handler: async (ctx, { token }) => {
//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", q => q.eq("token", token))
//       .first();

//     if (!session || session.expiresAt < Date.now()) return null;

//     return await ctx.db.get(session.tenantId);
//   },
// });

// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const createSession = mutation({
//   args: {
//     tenantId: v.id("tenants"),
//     token: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

//     await ctx.db.insert("tenantSessions", {
//       tenantId: args.tenantId,
//       token: args.token,
//       expiresAt,
//     });
//   },
// });


// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // -------------------------
// // CREATE SESSION
// // -------------------------
// export const createSession = mutation({
//   args: {
//     tenantId: v.id("tenants"),
//     token: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;

//     await ctx.db.insert("tenantSessions", {
//       tenantId: args.tenantId,
//       token: args.token,
//       expiresAt,
//     });
//   },
// });

// // -------------------------
// // GET SESSION BY TOKEN
// // -------------------------
// export const getByToken = query({
//   args: {
//     token: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (!session) return null;

//     if (Date.now() > session.expiresAt) return null;

//     return session;
//   },
// });


// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const createSession = mutation({
//   args: { tenantId: v.id("tenants"), token: v.string() },
//   handler: async (ctx, args) => {
//     const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;
//     await ctx.db.insert("tenantSessions", {
//       tenantId: args.tenantId,
//       token: args.token,
//       expiresAt,
//     });
//   },
// });

// // 
// export const getByToken = query({
//   args: { token: v.string() },

//   handler: async (ctx, args) => {
//     // find the session
//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (!session) return null;

//     // get the tenant
//     const tenant = await ctx.db.get(session.tenantId);
//     if (!tenant) return null;

//     return {
//       tenantId: tenant._id,
//       propertyId: tenant.propertyId,
//       unitId: tenant.unitId,
//     };
//   },
// });

// // ⭐ THE MISSING PART
// export const deleteSession = mutation({
//   args: { token: v.string() },
//   handler: async (ctx, args) => {
//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (session) {
//       await ctx.db.delete(session._id);
//     }
//   },
// });


// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// /* -----------------------------------------------------
//    1. CREATE SESSION
// ------------------------------------------------------ */
// export const createSession = mutation({
//   args: { tenantId: v.id("tenants"), token: v.string() },

//   handler: async (ctx, { tenantId, token }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const companyId = identity.subject;

//     // verify tenant belongs to same company
//     const tenant = await ctx.db.get(tenantId);
//     if (!tenant || tenant.companyId !== companyId)
//       throw new Error("Invalid tenant");

//     const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;

//     await ctx.db.insert("tenantSessions", {
//       tenantId,
//       token,
//       expiresAt,
//       companyId,
//     });
//   },
// });

// /* -----------------------------------------------------
//    2. GET SESSION BY TOKEN
// ------------------------------------------------------ */
// export const getByToken = query({
//   args: { token: v.string() },

//   handler: async (ctx, { token }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     const companyId = identity.subject;

//     // find session
//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", (q) => q.eq("token", token))
//       .filter((q) => q.eq(q.field("companyId"), companyId))
//       .first();

//     if (!session) return null;

//     // fetch tenant but ensure company match
//     const tenant = await ctx.db.get(session.tenantId);
//     if (!tenant || tenant.companyId !== companyId) return null;

//     return {
//       tenantId: tenant._id,
//       propertyId: tenant.propertyId,
//       unitId: tenant.unitId,
//     };
//   },
// });

// /* -----------------------------------------------------
//    3. DELETE SESSION
// ------------------------------------------------------ */
// export const deleteSession = mutation({
//   args: { token: v.string() },

//   handler: async (ctx, { token }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const companyId = identity.subject;

//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", (q) => q.eq("token", token))
//       .filter((q) => q.eq(q.field("companyId"), companyId))
//       .first();

//     if (session) {
//       await ctx.db.delete(session._id);
//     }
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// DEV MODE COMPANY ID
async function getCompanyId(ctx: any) {
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}

/* -----------------------------------------------------
   1. CREATE SESSION
------------------------------------------------------ */
export const createSession = mutation({
  args: { tenantId: v.id("tenants"), token: v.string() },

  handler: async (ctx, { tenantId, token }) => {
    const companyId = await getCompanyId(ctx);

    // verify tenant belongs to same company
    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId)
      throw new Error("Invalid tenant");

    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;

    await ctx.db.insert("tenantSessions", {
      tenantId,
      token,
      expiresAt,
      companyId,
    });
  },
});

/* -----------------------------------------------------
   2. GET SESSION BY TOKEN
------------------------------------------------------ */
export const getByToken = query({
  args: { token: v.string() },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyId(ctx);

    const session = await ctx.db
      .query("tenantSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .first();

    if (!session) return null;

    const tenant = await ctx.db.get(session.tenantId);
    if (!tenant || tenant.companyId !== companyId) return null;

    return {
      tenantId: tenant._id,
      propertyId: tenant.propertyId,
      unitId: tenant.unitId,
    };
  },
});

/* -----------------------------------------------------
   3. DELETE SESSION
------------------------------------------------------ */
export const deleteSession = mutation({
  args: { token: v.string() },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyId(ctx);

    const session = await ctx.db
      .query("tenantSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .first();

    if (session) await ctx.db.delete(session._id);
  },
});
