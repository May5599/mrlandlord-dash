import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";
import {
  sendMaintenanceAssignedEmail,
  sendMaintenanceCompletedEmail,
  sendMaintenanceStatusUpdatedEmail,
} from "./_lib/emailService";
import { insertNotification } from "./_lib/notificationHelpers";

/* -----------------------------------------------------
   1. CREATE MAINTENANCE REQUEST
----------------------------------------------------- */
export const createMaintenance = mutation({
  args: {
    token: v.string(),

    propertyId: v.id("properties"),
    unitId: v.id("units"),
    tenantId: v.optional(v.id("tenants")),

    title: v.string(),
    description: v.string(),

    category: v.string(),
    severity: v.string(),
    location: v.string(),

    accessPreference: v.optional(v.string()),
    allowEntry: v.optional(v.boolean()),

    images: v.optional(v.array(v.string())),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromToken(ctx, args.token);
    const now = new Date().toISOString();

    const id = await ctx.db.insert("maintenance", {
      companyId,

      propertyId: args.propertyId,
      unitId: args.unitId,
      tenantId: args.tenantId,

      title: args.title,
      description: args.description,
      category: args.category,
      severity: args.severity,
      location: args.location,

      accessPreference: args.accessPreference,
      allowEntry: args.allowEntry,
      images: args.images,

      priority: args.severity,
      status: "open",

      assignedVendorId: undefined,
      assignedAt: undefined,
      hoursLog: [],

      cost: undefined,
      lastNotificationSent: undefined,

      createdAt: now,
      updatedAt: now,
    });

    await insertNotification(ctx.db, {
      companyId,
      type: "maintenance_submitted",
      message: `New maintenance request created: "${args.title}"`,
      maintenanceId: id,
      tenantId: args.tenantId,
    });

    return { success: true, requestId: id };
  },
});

/* -----------------------------------------------------
   2. ASSIGN VENDOR
----------------------------------------------------- */
export const assignVendor = mutation({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
    vendorId: v.id("vendors"),
  },

  handler: async (ctx, { token, id, vendorId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const req = await ctx.db.get(id);

    if (!req || req.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    if (!req.scheduledDate || !req.scheduledTimeFrom || !req.scheduledTimeTo) {
      throw new Error("Cannot assign vendor without scheduled date and time");
    }

    const [vendor, property, unit, company] = await Promise.all([
      ctx.db.get(vendorId),
      ctx.db.get(req.propertyId),
      ctx.db.get(req.unitId),
      ctx.db.get(companyId),
    ]);

    await ctx.db.patch(id, {
      assignedVendorId: vendorId,
      assignedAt: new Date().toISOString(),
      status: "in-progress",
      updatedAt: new Date().toISOString(),
    });

    // In-app notification
    await insertNotification(ctx.db, {
      companyId,
      type: "vendor_assigned",
      message: `Vendor "${vendor?.name ?? "Vendor"}" assigned to "${req.title}"`,
      maintenanceId: id,
      vendorId,
    });

    // Email to vendor
    if (vendor?.email) {
      try {
        await sendMaintenanceAssignedEmail(
          vendor.email,
          vendor.name ?? "Vendor",
          property?.name ?? "Property",
          unit?.unitNumber ?? "Unit",
          req.title,
          req.priority,
          req.scheduledDate,
          `${req.scheduledTimeFrom} – ${req.scheduledTimeTo}`,
          req.accessPreference,
          company?.name
        );
      } catch (error) {
        console.error("Failed to send maintenance assigned email:", error);
      }
    }

    // Email to tenant — notify their request has a vendor assigned
    if (req.tenantId) {
      const tenant = await ctx.db.get(req.tenantId);
      if (tenant?.email) {
        try {
          await sendMaintenanceStatusUpdatedEmail(
            tenant.email,
            tenant.name,
            req.title,
            "in-progress",
            property?.name ?? "Property",
            unit?.unitNumber ?? "Unit",
            company?.name
          );
        } catch (error) {
          console.error("Failed to send tenant assignment notification email:", error);
        }
      }
    }

    return { success: true };
  },
});

/* -----------------------------------------------------
   3. LOG HOURS
----------------------------------------------------- */
export const logHours = mutation({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
    vendorId: v.id("vendors"),
    hours: v.number(),
    note: v.optional(v.string()),
  },

  handler: async (ctx, { token, id, vendorId, hours, note }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const req = await ctx.db.get(id);

    if (!req || req.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    const newEntry = {
      vendorId,
      hours,
      date: new Date().toISOString(),
      note: note ?? "",
    };

    await ctx.db.patch(id, {
      hoursLog: [...(req.hoursLog ?? []), newEntry],
      updatedAt: new Date().toISOString(),
    });

    await insertNotification(ctx.db, {
      companyId,
      type: "hours_logged",
      message: `${hours} hours logged on "${req.title}"`,
      maintenanceId: id,
      vendorId,
    });

    return { success: true };
  },
});

/* -----------------------------------------------------
   4. GET MAINTENANCE BY PROPERTY
----------------------------------------------------- */
export const getMaintenanceByProperty = query({
  args: {
    token: v.string(),
    propertyId: v.id("properties"),
  },

  handler: async (ctx, { token, propertyId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return ctx.db
      .query("maintenance")
      .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   5. GET MAINTENANCE BY STATUS
----------------------------------------------------- */
export const getMaintenanceByStatus = query({
  args: {
    token: v.string(),
    status: v.string(),
  },

  handler: async (ctx, { token, status }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return ctx.db
      .query("maintenance")
      .withIndex("by_status", (q) => q.eq("status", status))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   6. GET MAINTENANCE BY ID
----------------------------------------------------- */
export const getMaintenanceById = query({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
  },

  handler: async (ctx, { token, id }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const req = await ctx.db.get(id);

    if (!req || req.companyId !== companyId) return null;
    return req;
  },
});

/* -----------------------------------------------------
   7. UPDATE MAINTENANCE
----------------------------------------------------- */
export const updateMaintenance = mutation({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      severity: v.optional(v.string()),
      location: v.optional(v.string()),
      accessPreference: v.optional(v.string()),
      allowEntry: v.optional(v.boolean()),
      priority: v.optional(v.string()),
      status: v.optional(v.string()),
      cost: v.optional(v.number()),
      images: v.optional(v.array(v.string())),
      assignedVendorId: v.optional(v.id("vendors")),
      lastNotificationSent: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { token, id, updates }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const req = await ctx.db.get(id);

    if (!req || req.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const [property, unit, company] = await Promise.all([
      ctx.db.get(req.propertyId),
      ctx.db.get(req.unitId),
      ctx.db.get(companyId),
    ]);

    // Email vendor when completed
    if (updates.status === "completed" && req.assignedVendorId) {
      const vendor = await ctx.db.get(req.assignedVendorId);
      if (vendor?.email) {
        try {
          await sendMaintenanceCompletedEmail(
            vendor.email,
            vendor.name ?? "Vendor",
            property?.name ?? "Property",
            unit?.unitNumber ?? "Unit",
            req.title,
            company?.name
          );
        } catch (error) {
          console.error("Failed to send maintenance completed email:", error);
        }
      }
    }

    // Email tenant on any status change
    if (updates.status && req.tenantId) {
      const tenant = await ctx.db.get(req.tenantId);
      if (tenant?.email) {
        try {
          await sendMaintenanceStatusUpdatedEmail(
            tenant.email,
            tenant.name,
            req.title,
            updates.status,
            property?.name ?? "Property",
            unit?.unitNumber ?? "Unit",
            company?.name
          );
        } catch (error) {
          console.error("Failed to send tenant status update email:", error);
        }
      }
    }

    // In-app notification on status change
    if (updates.status) {
      await insertNotification(ctx.db, {
        companyId,
        type: "status_updated",
        message: `"${req.title}" status updated to ${updates.status}`,
        maintenanceId: id,
        vendorId: updates.assignedVendorId ?? req.assignedVendorId,
        tenantId: req.tenantId,
        status: updates.status,
      });
    }

    return { success: true };
  },
});

/* -----------------------------------------------------
   8. DELETE MAINTENANCE REQUEST
----------------------------------------------------- */
export const deleteRequest = mutation({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
  },

  handler: async (ctx, { token, id }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const req = await ctx.db.get(id);

    if (!req || req.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);
    return true;
  },
});

/* -----------------------------------------------------
   9. GET ALL MAINTENANCE REQUESTS
----------------------------------------------------- */
export const getAllRequests = query({
  args: { token: v.string() },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return ctx.db
      .query("maintenance")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   10. GET REQUESTS BY VENDOR
----------------------------------------------------- */
export const getRequestsByVendor = query({
  args: {
    token: v.string(),
    vendorId: v.id("vendors"),
  },

  handler: async (ctx, { token, vendorId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return ctx.db
      .query("maintenance")
      .withIndex("by_vendor", (q) => q.eq("assignedVendorId", vendorId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();
  },
});

/* -----------------------------------------------------
   SCHEDULE MAINTENANCE
----------------------------------------------------- */
export const scheduleMaintenance = mutation({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
    scheduledDate: v.string(),
    scheduledTimeFrom: v.string(),
    scheduledTimeTo: v.string(),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromToken(ctx, args.token);
    const req = await ctx.db.get(args.id);

    if (!req || req.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      scheduledDate: args.scheduledDate,
      scheduledTimeFrom: args.scheduledTimeFrom,
      scheduledTimeTo: args.scheduledTimeTo,
      updatedAt: new Date().toISOString(),
    });

    // In-app notification
    await insertNotification(ctx.db, {
      companyId,
      type: "maintenance_scheduled",
      message: `"${req.title}" scheduled for ${args.scheduledDate}`,
      maintenanceId: args.id,
      tenantId: req.tenantId,
    });

    // Email tenant about the scheduled visit
    if (req.tenantId) {
      const [tenant, property, unit, company] = await Promise.all([
        ctx.db.get(req.tenantId),
        ctx.db.get(req.propertyId),
        ctx.db.get(req.unitId),
        ctx.db.get(companyId),
      ]);
      if (tenant?.email) {
        try {
          await sendMaintenanceStatusUpdatedEmail(
            tenant.email,
            tenant.name,
            req.title,
            "scheduled",
            property?.name ?? "Property",
            unit?.unitNumber ?? "Unit",
            company?.name
          );
        } catch (error) {
          console.error("Failed to send tenant schedule email:", error);
        }
      }
    }

    return { success: true };
  },
});
