import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addVendor = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    specialty: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vendors", args);
  },
});

export const getVendors = query({
  handler: async (ctx) => {
    return await ctx.db.query("vendors").order("desc").collect();
  },
});

export const deleteVendor = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
