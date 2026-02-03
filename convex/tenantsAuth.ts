import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
