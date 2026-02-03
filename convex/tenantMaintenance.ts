// import { mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { getTenantFromToken } from "./_lib/getTenantFromToken";

// export const createRequest = mutation({
//   args: {
//     token: v.string(),

//     title: v.string(),
//     description: v.string(),
//     category: v.string(),
//     severity: v.string(),
//     location: v.string(),

//     accessPreference: v.optional(v.string()),
//     allowEntry: v.optional(v.boolean()),
//     images: v.optional(v.array(v.string())),
//   },

//   handler: async (ctx, args) => {
//     const { tenant, companyId } = await getTenantFromToken(ctx, args.token);
//     const now = new Date().toISOString();

//     const id = await ctx.db.insert("maintenance", {
//       companyId,
//       tenantId: tenant._id,
//       propertyId: tenant.propertyId,
//       unitId: tenant.unitId,

//       title: args.title,
//       description: args.description,
//       category: args.category,
//       severity: args.severity,
//       location: args.location,

//       accessPreference: args.accessPreference,
//       allowEntry: args.allowEntry,
//       images: args.images,

//       priority: args.severity,
//       status: "open",

//       assignedVendorId: undefined,
//       assignedAt: undefined,
//       hoursLog: [],
//       cost: undefined,
//       lastNotificationSent: undefined,

//       createdAt: now,
//       updatedAt: now,
//     });

//     return { success: true, requestId: id };
//   },
// });
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getTenantFromToken } from "./_lib/getTenantFromToken";

/* ------------------------------------------------------------------ */
/* CREATE REQUEST */
/* ------------------------------------------------------------------ */

export const createRequest = mutation({
  args: {
    token: v.string(),

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
    const { tenant, companyId } = await getTenantFromToken(ctx, args.token);
    const now = new Date().toISOString();

    const id = await ctx.db.insert("maintenance", {
      companyId,
      tenantId: tenant._id,
      propertyId: tenant.propertyId,
      unitId: tenant.unitId,

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

      scheduledDate: undefined,
      scheduledTimeFrom: undefined,
      scheduledTimeTo: undefined,

      hoursLog: [],
      cost: undefined,
      lastNotificationSent: undefined,

      createdAt: now,
      updatedAt: now,
    });

    return { success: true, requestId: id };
  },
});

/* ------------------------------------------------------------------ */
/* GET ALL REQUESTS FOR TENANT */
/* ------------------------------------------------------------------ */

export const getMyRequests = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, args) => {
    const { tenant } = await getTenantFromToken(ctx, args.token);

    return await ctx.db
      .query("maintenance")
      .withIndex("by_tenant", (q) =>
        q.eq("tenantId", tenant._id)
      )
      .order("desc")
      .collect();
  },
});

/* ------------------------------------------------------------------ */
/* GET SINGLE REQUEST (DETAIL VIEW) */
/* ------------------------------------------------------------------ */

export const getMyRequestById = query({
  args: {
    token: v.string(),
    id: v.id("maintenance"),
  },

  handler: async (ctx, args) => {
    const { tenant } = await getTenantFromToken(ctx, args.token);

    const request = await ctx.db.get(args.id);

    if (!request || request.tenantId !== tenant._id) {
      throw new Error("Unauthorized");
    }

    return request;
  },
});
