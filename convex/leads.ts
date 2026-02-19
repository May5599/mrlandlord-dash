import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    portfolioSize: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
