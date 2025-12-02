
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveOtp = mutation({
  args: {
    email: v.string(),
    otp: v.string(),
    otpExpiresAt: v.number(),
  },
  handler: async (ctx, { email, otp, otpExpiresAt }) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (!tenant) throw new Error("No tenant found");

    await ctx.db.patch(tenant._id, { otp, otpExpiresAt });
  },
});






export const verifyOtp = mutation({
  args: { email: v.string(), otp: v.string() },
  handler: async (ctx, { email, otp }) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (!tenant) return { success: false, message: "Not found" };

    if (tenant.otp !== otp)
      return { success: false, message: "Incorrect code" };

    if (!tenant.otpExpiresAt || Date.now() > tenant.otpExpiresAt)
      return { success: false, message: "Expired" };

    return { success: true, tenantId: tenant._id };
  },
});
