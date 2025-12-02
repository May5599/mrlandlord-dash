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
