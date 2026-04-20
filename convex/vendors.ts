// convex/vendors.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";
import { internal } from "./_generated/api";
import { insertNotification } from "./_lib/notificationHelpers";

/* -----------------------------------------------------
   ADD VENDOR
------------------------------------------------------ */
export const addVendor = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    specialty: v.optional(v.string()),
    createdAt: v.string(),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromToken(ctx, args.token);

    const [vendorId, company] = await Promise.all([
      ctx.db.insert("vendors", {
        companyId,
        name: args.name,
        phone: args.phone,
        email: args.email,
        specialty: args.specialty,
        createdAt: args.createdAt,
      }),
      ctx.db.get(companyId),
    ]);

    if (args.email) {
      await ctx.scheduler.runAfter(0, internal.emailActions.sendVendorWelcome, {
        vendorEmail: args.email,
        vendorName: args.name,
        specialty: args.specialty,
        companyName: company?.name,
      });
    }

    // In-app notification for company admin
    await insertNotification(ctx.db, {
      companyId,
      type: "vendor_added",
      message: `New vendor added: ${args.name}${args.specialty ? ` (${args.specialty})` : ""}`,
      vendorId,
    });

    return vendorId;
  },
});

/* -----------------------------------------------------
   GET VENDORS (COMPANY SCOPED)
------------------------------------------------------ */
export const getVendors = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return await ctx.db
      .query("vendors")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   DELETE VENDOR
------------------------------------------------------ */
export const deleteVendor = mutation({
  args: {
    token: v.string(),
    id: v.id("vendors"),
  },

  handler: async (ctx, { token, id }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    const vendor = await ctx.db.get(id);
    if (!vendor || vendor.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);
    return true;
  },
});

/* -----------------------------------------------------
   GET VENDOR BY ID
------------------------------------------------------ */
export const getVendorById = query({
  args: {
    token: v.string(),
    id: v.id("vendors"),
  },

  handler: async (ctx, { token, id }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    const vendor = await ctx.db.get(id);
    if (!vendor || vendor.companyId !== companyId) {
      return null;
    }

    return vendor;
  },
});
