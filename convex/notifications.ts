

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";

/* -----------------------------------------------------
   CREATE NOTIFICATION
------------------------------------------------------ */
export const createNotification = mutation({
  args: {
    token: v.string(),

    type: v.string(),
    message: v.string(),
    maintenanceId: v.id("maintenance"),

    vendorId: v.optional(v.id("vendors")),
    tenantId: v.optional(v.id("tenants")),
    status: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromToken(ctx, args.token);

    await ctx.db.insert("notifications", {
      type: args.type,
      message: args.message,
      maintenanceId: args.maintenanceId,
      vendorId: args.vendorId,
      tenantId: args.tenantId,
      status: args.status,

      companyId,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // determine email recipient
    let recipientEmail: string | null = null;

    if (args.vendorId) {
      const vendor = await ctx.db.get(args.vendorId);
      recipientEmail = vendor?.email ?? null;
    }

    if (args.tenantId) {
      const tenant = await ctx.db.get(args.tenantId);
      recipientEmail = tenant?.email ?? null;
    }

    // fallback manager email
    if (!recipientEmail) {
      recipientEmail = "mayankcan999@gmail.com";
    }

  await ctx.runMutation(api.sendEmail.sendEmail, {
  to: recipientEmail,
  subject: `Maintenance Update: ${args.type}`,
  html: `<p>${args.message}</p>`,
});


    return { success: true };
  },
});

/* -----------------------------------------------------
   GET COMPANY NOTIFICATIONS
------------------------------------------------------ */
export const getCompanyNotifications = query({
  args: { token: v.string() },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return await ctx.db
      .query("notifications")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   MARK AS READ
------------------------------------------------------ */
export const markAsRead = mutation({
  args: {
    token: v.string(),
    id: v.id("notifications"),
  },

  handler: async (ctx, { token, id }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const notif = await ctx.db.get(id);

    if (!notif || notif.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { read: true });
    return true;
  },
});

/* -----------------------------------------------------
   UNREAD COUNT (SAFE)
------------------------------------------------------ */
export const getUnreadCount = query({
  args: { token: v.optional(v.string()) },

  handler: async (ctx, { token }) => {
    if (!token) return 0;

    const companyId = await getCompanyIdFromToken(ctx, token);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    return unread.length;
  },
});