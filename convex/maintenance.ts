// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // -----------------------------------------------------
// // 1. Create maintenance request (Tenant)
// // -----------------------------------------------------
// // export const createRequest = mutation({
// //   args: {
// //     tenantId: v.id("tenants"),
// //     propertyId: v.id("properties"),
// //     unitId: v.id("units"),

// //     title: v.string(),
// //     description: v.string(),

// //     category: v.string(),          // plumbing, electrical, etc.
// //     severity: v.string(),          // low, medium, high, emergency
// //     location: v.string(),          // kitchen, bathroom, etc.

// //     accessPreference: v.optional(v.string()),  // morning, evening, anytime
// //     allowEntry: v.optional(v.boolean()),       // yes or no

// //     images: v.optional(v.array(v.string())),
// //   },

// //   handler: async (ctx, args) => {
// //     const now = new Date().toISOString();

// //     const id = await ctx.db.insert("maintenance", {
// //       ...args,

// //       priority: args.severity,    // backwards compatibility
// //       status: "open",
// //       cost: undefined,

// //       createdAt: now,
// //       updatedAt: now,
// //     });

// //     return { success: true, requestId: id };
// //   },
// // });
// export const createMaintenance = mutation({
//   args: {
//     propertyId: v.id("properties"),
//     unitId: v.id("units"),
//     tenantId: v.optional(v.id("tenants")),

//     title: v.string(),
//     description: v.string(),

//     category: v.string(),      // plumbing, electrical, HVAC, etc.
//     severity: v.string(),      // low, medium, high, emergency
//     location: v.string(),      // kitchen, bathroom, bedroom…

//     accessPreference: v.optional(v.string()), // morning, evening, anytime, appointment
//     allowEntry: v.optional(v.boolean()),      // yes or no

//     images: v.optional(v.array(v.string())),
//   },

//   handler: async (ctx, args) => {
//     const now = new Date().toISOString();

//     const id = await ctx.db.insert("maintenance", {
//       ...args,
//       priority: args.severity,  // compatibility with older UI
//       status: "open",
//       cost: undefined,
//       createdAt: now,
//       updatedAt: now,
//     });

//     return { success: true, requestId: id };
//   },
// });

// // -----------------------------------------------------
// // 2. Get all maintenance for a specific property
// // -----------------------------------------------------
// export const getMaintenanceByProperty = query({
//   args: { propertyId: v.id("properties") },

//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("maintenance")
//       .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
//       .order("desc")
//       .collect();
//   },
// });

// // -----------------------------------------------------
// // 3. Get maintenance by status (manager dashboard)
// // -----------------------------------------------------
// export const getMaintenanceByStatus = query({
//   args: { status: v.string() },

//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("maintenance")
//       .withIndex("by_status", (q) => q.eq("status", args.status))
//       .order("desc")
//       .collect();
//   },
// });

// // -----------------------------------------------------
// // 4. Get single maintenance request
// // -----------------------------------------------------
// export const getMaintenanceById = query({
//   args: { id: v.id("maintenance") },

//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });

// // -----------------------------------------------------
// // 5. Update maintenance request (Manager)
// // -----------------------------------------------------
// export const updateMaintenance = mutation({
//   args: {
//     id: v.id("maintenance"),
//     updates: v.object({
//       title: v.optional(v.string()),
//       description: v.optional(v.string()),

//       category: v.optional(v.string()),
//       severity: v.optional(v.string()),
//       location: v.optional(v.string()),

//       accessPreference: v.optional(v.string()),
//       allowEntry: v.optional(v.boolean()),

//       priority: v.optional(v.string()),
//       status: v.optional(v.string()), // open, in-progress, completed

//       cost: v.optional(v.number()),
//       images: v.optional(v.array(v.string())),
//     }),
//   },

//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, {
//       ...args.updates,
//       updatedAt: new Date().toISOString(),
//     });

//     return { success: true };
//   },
// });

// // -----------------------------------------------------
// // 6. Delete request
// // -----------------------------------------------------
// export const deleteRequest = mutation({
//   args: { id: v.id("maintenance") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//     return true;
//   },
// });

// // -----------------------------------------------------
// // 7. Manager — Fetch all requests
// // -----------------------------------------------------
// export const getAllRequests = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("maintenance").order("desc").collect();
//   },
// });

// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";
// import { api } from "./_generated/api";

// /* -----------------------------------------------------
//     1. Create Maintenance Request (Tenant)
// ----------------------------------------------------- */
// // export const createMaintenance = mutation({
// //   args: {
// //     companyId: v.id("companies"),        // NEW
// //     propertyId: v.id("properties"),
// //     unitId: v.id("units"),
// //     tenantId: v.optional(v.id("tenants")),

// //     title: v.string(),
// //     description: v.string(),

// //     category: v.string(),
// //     severity: v.string(),
// //     location: v.string(),

// //     accessPreference: v.optional(v.string()),
// //     allowEntry: v.optional(v.boolean()),

// //     images: v.optional(v.array(v.string())),
// //   },

// //   handler: async (ctx, args) => {
// //     const now = new Date().toISOString();

// //     const id = await ctx.db.insert("maintenance", {
// //       ...args,
// //       priority: args.severity,
// //       status: "open",

// //       assignedVendorId: undefined,
// //       assignedAt: undefined,

// //       hoursLog: [],
// //       lastNotificationSent: undefined,
// //       cost: undefined,

// //       createdAt: now,
// //       updatedAt: now,
// //     });

// //     return { success: true, requestId: id };
// //   },
// // });
// export const createMaintenance = mutation({
//   args: {
//     propertyId: v.id("properties"),
//     unitId: v.id("units"),
//     tenantId: v.optional(v.id("tenants")),

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
//     const companyId = await getCompanyId(ctx);   // 🔥 AUTO-INJECTED
//     const now = new Date().toISOString();

//     const id = await ctx.db.insert("maintenance", {
//       ...args,
//       companyId,                                 // 🔥 STORED SECURELY
//       priority: args.severity,
//       status: "open",

//       assignedVendorId: undefined,
//       assignedAt: undefined,

//       hoursLog: [],
//       lastNotificationSent: undefined,
//       cost: undefined,

//       createdAt: now,
//       updatedAt: now,
//     });

//     return { success: true, requestId: id };
//   },
// });

// /* -----------------------------------------------------
//     2. Assign Vendor (Manager)
// ----------------------------------------------------- */
// // export const assignVendor = mutation({
// //   args: {
// //     companyId: v.id("companies"),        // NEW
// //     id: v.id("maintenance"),
// //     vendorId: v.id("vendors"),
// //   },

// //   handler: async (ctx, args) => {
// //     const req = await ctx.db.get(args.id);
// //     if (!req || req.companyId !== args.companyId)
// //       throw new Error("Unauthorized or missing request");

// //     await ctx.db.patch(args.id, {
// //       assignedVendorId: args.vendorId,
// //       assignedAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //     });

// //     await ctx.runMutation(api.notifications.createNotification, {
// //   type: "vendor_assigned",
// //   message: `Vendor has been assigned to request.`,
// //   maintenanceId: args.id,
// //   vendorId: args.vendorId,
// // });


// //     return { success: true };
// //   },
// // });
// export const assignVendor = mutation({
//   args: {
//     id: v.id("maintenance"),
//     vendorId: v.id("vendors"),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);   // secure
//     const req = await ctx.db.get(args.id);

//     if (!req || req.companyId !== companyId)
//       throw new Error("Unauthorized or missing request");

//     await ctx.db.patch(args.id, {
//       assignedVendorId: args.vendorId,
//       assignedAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });

//     await ctx.runMutation(api.notifications.createNotification, {
//       type: "vendor_assigned",
//       message: `Vendor has been assigned to request.`,
//       maintenanceId: args.id,
//       vendorId: args.vendorId,
//     });

//     return { success: true };
//   },
// });

// /* -----------------------------------------------------
//     3. Add Hours To Request (Vendor Work Log)
// ----------------------------------------------------- */
// // export const logHours = mutation({
// //   args: {
// //     companyId: v.id("companies"),        // NEW
// //     id: v.id("maintenance"),
// //     vendorId: v.id("vendors"),
// //     hours: v.number(),
// //     note: v.optional(v.string()),
// //   },

// //   handler: async (ctx, args) => {
// //     const req = await ctx.db.get(args.id);
// //     if (!req || req.companyId !== args.companyId)
// //       throw new Error("Unauthorized");

// //     const newEntry = {
// //       vendorId: args.vendorId,
// //       hours: args.hours,
// //       date: new Date().toISOString(),
// //       note: args.note ?? "",
// //     };

// //     await ctx.db.patch(args.id, {
// //       hoursLog: [...(req.hoursLog ?? []), newEntry],
// //       updatedAt: new Date().toISOString(),
// //     });

// //     await ctx.runMutation(api.notifications.createNotification, {
// //   type: "hours_logged",
// //   message: `${args.hours} hours added.`,
// //   maintenanceId: args.id,
// //   vendorId: args.vendorId,
// // });


// //     return { success: true };
// //   },
// // });
// export const logHours = mutation({
//   args: {
//     id: v.id("maintenance"),
//     vendorId: v.id("vendors"),
//     hours: v.number(),
//     note: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);
//     const req = await ctx.db.get(args.id);

//     if (!req || req.companyId !== companyId)
//       throw new Error("Unauthorized");

//     const newEntry = {
//       vendorId: args.vendorId,
//       hours: args.hours,
//       date: new Date().toISOString(),
//       note: args.note ?? "",
//     };

//     await ctx.db.patch(args.id, {
//       hoursLog: [...(req.hoursLog ?? []), newEntry],
//       updatedAt: new Date().toISOString(),
//     });

//     await ctx.runMutation(api.notifications.createNotification, {
//       type: "hours_logged",
//       message: `${args.hours} hours added.`,
//       maintenanceId: args.id,
//       vendorId: args.vendorId,
//     });

//     return { success: true };
//   },
// });

// /* -----------------------------------------------------
//     4. Get Maintenance By Property
// ----------------------------------------------------- */
// // export const getMaintenanceByProperty = query({
// //   // args: {
// //   //   companyId: v.id("companies"),        // NEW
// //   //   propertyId: v.id("properties"),
// //   // },
// //     const companyId = await getCompanyId(ctx);

// //   handler: async (ctx, args) => {
// //     return await ctx.db
// //       .query("maintenance")
// //       .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
// //       .filter((q) => q.eq(q.field("companyId"), args.companyId))
// //       .order("desc")
// //       .collect();
// //   },
// // });
// export const getMaintenanceByProperty = query({
//   args: {
//     propertyId: v.id("properties"),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

//     return await ctx.db
//       .query("maintenance")
//       .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
//       .filter((q) => q.eq(q.field("companyId"), companyId))
//       .order("desc")
//       .collect();
//   },
// });

// /* -----------------------------------------------------
//     5. Get maintenance by status
// ----------------------------------------------------- */
// export const getMaintenanceByStatus = query({
//   args: {
//     companyId: v.id("companies"),        // NEW
//     status: v.string(),
//   },

//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("maintenance")
//       .withIndex("by_status", (q) => q.eq("status", args.status))
//       .filter((q) => q.eq(q.field("companyId"), args.companyId))
//       .order("desc")
//       .collect();
//   },
// });

// /* -----------------------------------------------------
//     6. Get Single Request
// ----------------------------------------------------- */
// export const getMaintenanceById = query({
//   args: {
//     companyId: v.id("companies"),        // NEW
//     id: v.id("maintenance"),
//   },

//   handler: async (ctx, args) => {
//     const req = await ctx.db.get(args.id);
//     if (!req || req.companyId !== args.companyId) return null;
//     return req;
//   },
// });

// /* -----------------------------------------------------
//     7. Update Maintenance Request
// ----------------------------------------------------- */
// export const updateMaintenance = mutation({
//   args: {
//     companyId: v.id("companies"),        // NEW
//     id: v.id("maintenance"),
//     updates: v.object({
//       title: v.optional(v.string()),
//       description: v.optional(v.string()),

//       category: v.optional(v.string()),
//       severity: v.optional(v.string()),
//       location: v.optional(v.string()),

//       accessPreference: v.optional(v.string()),
//       allowEntry: v.optional(v.boolean()),

//       priority: v.optional(v.string()),
//       status: v.optional(v.string()),

//       cost: v.optional(v.number()),
//       images: v.optional(v.array(v.string())),

//       assignedVendorId: v.optional(v.id("vendors")),
//       lastNotificationSent: v.optional(v.string()),
//     }),
//   },

//   handler: async (ctx, args) => {
//     const req = await ctx.db.get(args.id);
//     if (!req || req.companyId !== args.companyId)
//       throw new Error("Unauthorized");

//     await ctx.db.patch(args.id, {
//       ...args.updates,
//       updatedAt: new Date().toISOString(),
//     });

//     if (args.updates.status) {
//   await ctx.runMutation(api.notifications.createNotification, {
//     type: "status_updated",
//     message: `Status updated to ${args.updates.status}`,
//     maintenanceId: args.id,
//     vendorId: args.updates.assignedVendorId,
//     status: args.updates.status,
//   });
// }


//     return { success: true };
//   },
// });

// /* -----------------------------------------------------
//     8. Delete Request
// ----------------------------------------------------- */
// export const deleteRequest = mutation({
//   args: {
//     companyId: v.id("companies"),        // NEW
//     id: v.id("maintenance"),
//   },

//   handler: async (ctx, args) => {
//     const req = await ctx.db.get(args.id);
//     if (!req || req.companyId !== args.companyId)
//       throw new Error("Unauthorized");

//     await ctx.db.delete(args.id);
//     return true;
//   },
// });

// /* -----------------------------------------------------
//     9. Get All Requests
// ----------------------------------------------------- */
// export const getAllRequests = query({
//   args: { companyId: v.id("companies") },

//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("maintenance")
//       .filter((q) => q.eq(q.field("companyId"), args.companyId))
//       .order("desc")
//       .collect();
//   },
// });

// /* -----------------------------------------------------
//     10. Requests Assigned To Vendor
// ----------------------------------------------------- */
// export const getRequestsByVendor = query({
//   args: {
//     companyId: v.id("companies"),        // NEW
//     vendorId: v.id("vendors"),
//   },

//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("maintenance")
//       .withIndex("by_vendor", (q) => q.eq("assignedVendorId", args.vendorId))
//       .filter((q) => q.eq(q.field("companyId"), args.companyId))
//       .collect();
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/* -----------------------------------------------------
   TEMPORARY DEV MODE: always return one companyId
----------------------------------------------------- */
async function getCompanyId(ctx: any) {
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}

/* -----------------------------------------------------
   1. CREATE MAINTENANCE REQUEST (Tenant)
----------------------------------------------------- */
export const createMaintenance = mutation({
  args: {
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
    const companyId = await getCompanyId(ctx);
    const now = new Date().toISOString();

    const id = await ctx.db.insert("maintenance", {
      ...args,
      companyId,
      priority: args.severity,
      status: "open",

      assignedVendorId: undefined,
      assignedAt: undefined,

      hoursLog: [],
      lastNotificationSent: undefined,
      cost: undefined,

      createdAt: now,
      updatedAt: now,
    });

    return { success: true, requestId: id };
  },
});

/* -----------------------------------------------------
   2. ASSIGN VENDOR (Manager)
----------------------------------------------------- */
export const assignVendor = mutation({
  args: {
    id: v.id("maintenance"),
    vendorId: v.id("vendors"),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);
    const req = await ctx.db.get(args.id);

    if (!req || req.companyId !== companyId)
      throw new Error("Unauthorized or missing request");

    await ctx.db.patch(args.id, {
      assignedVendorId: args.vendorId,
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await ctx.runMutation(api.notifications.createNotification, {
      type: "vendor_assigned",
      message: `Vendor has been assigned to request.`,
      maintenanceId: args.id,
      vendorId: args.vendorId,
    });

    return { success: true };
  },
});

/* -----------------------------------------------------
   3. LOG HOURS (Vendor)
----------------------------------------------------- */
export const logHours = mutation({
  args: {
    id: v.id("maintenance"),
    vendorId: v.id("vendors"),
    hours: v.number(),
    note: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);
    const req = await ctx.db.get(args.id);

    if (!req || req.companyId !== companyId)
      throw new Error("Unauthorized");

    const newEntry = {
      vendorId: args.vendorId,
      hours: args.hours,
      date: new Date().toISOString(),
      note: args.note ?? "",
    };

    await ctx.db.patch(args.id, {
      hoursLog: [...(req.hoursLog ?? []), newEntry],
      updatedAt: new Date().toISOString(),
    });

    await ctx.runMutation(api.notifications.createNotification, {
      type: "hours_logged",
      message: `${args.hours} hours added.`,
      maintenanceId: args.id,
      vendorId: args.vendorId,
    });

    return { success: true };
  },
});

/* -----------------------------------------------------
   4. GET MAINTENANCE BY PROPERTY
----------------------------------------------------- */
export const getMaintenanceByProperty = query({
  args: { propertyId: v.id("properties") },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("maintenance")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   5. GET BY STATUS
----------------------------------------------------- */
export const getMaintenanceByStatus = query({
  args: { status: v.string() },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("maintenance")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   6. GET SINGLE REQUEST
----------------------------------------------------- */
export const getMaintenanceById = query({
  args: { id: v.id("maintenance") },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);
    const req = await ctx.db.get(args.id);

    if (!req || req.companyId !== companyId) return null;
    return req;
  },
});

/* -----------------------------------------------------
   7. UPDATE MAINTENANCE
----------------------------------------------------- */
export const updateMaintenance = mutation({
  args: {
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

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);
    const req = await ctx.db.get(args.id);

    if (!req || req.companyId !== companyId)
      throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: new Date().toISOString(),
    });

    if (args.updates.status) {
      await ctx.runMutation(api.notifications.createNotification, {
        type: "status_updated",
        message: `Status updated to ${args.updates.status}`,
        maintenanceId: args.id,
        vendorId: args.updates.assignedVendorId,
        status: args.updates.status,
      });
    }

    return { success: true };
  },
});

/* -----------------------------------------------------
   8. DELETE REQUEST
----------------------------------------------------- */
export const deleteRequest = mutation({
  args: { id: v.id("maintenance") },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);
    const req = await ctx.db.get(args.id);

    if (!req || req.companyId !== companyId)
      throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
    return true;
  },
});

/* -----------------------------------------------------
   9. GET ALL REQUESTS
----------------------------------------------------- */
export const getAllRequests = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
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
  args: { vendorId: v.id("vendors") },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("maintenance")
      .withIndex("by_vendor", (q) => q.eq("assignedVendorId", args.vendorId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();
  },
});
