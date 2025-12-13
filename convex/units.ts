// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";


// // Get all units
// export const getAllUnits = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("units").order("desc").collect();
//   },
// });
// // -----------------------------------------------------
// // 1. Create Unit
// // -----------------------------------------------------
// export const createUnit = mutation({
//   args: {
//     propertyId: v.id("properties"),

//     unitNumber: v.string(),
//     type: v.string(),
//     size: v.optional(v.string()),
//     floor: v.optional(v.number()),

//     baseRent: v.number(),
//     status: v.string(), // vacant, occupied, maintenance

//     notes: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     return await ctx.db.insert("units", {
//       ...args,
//       currentTenantId: undefined,
//       createdAt: new Date().toISOString(),
//     });
//   },
// });

// // -----------------------------------------------------
// // 2. Get all units for a property
// // -----------------------------------------------------
// export const getUnitsByProperty = query({
//   args: { propertyId: v.id("properties") },

//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("units")
//       .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
//       .order("desc")
//       .collect();
//   },
// });

// // -----------------------------------------------------
// // 3. Get single unit
// // -----------------------------------------------------
// export const getUnitById = query({
//   args: { id: v.id("units") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });

// // -----------------------------------------------------
// // 4. Update unit
// // -----------------------------------------------------
// export const updateUnit = mutation({
//   args: {
//     id: v.id("units"),
//     updates: v.object({
//       unitNumber: v.optional(v.string()),
//       type: v.optional(v.string()),
//       size: v.optional(v.string()),
//       floor: v.optional(v.number()),
//       baseRent: v.optional(v.number()),
//       status: v.optional(v.string()),
//       notes: v.optional(v.string()),
//     }),
//   },

//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, {
//       ...args.updates,
//     });

//     return true;
//   },
// });

// // -----------------------------------------------------
// // 5. Assign Tenant (move-in)
// // -----------------------------------------------------
// export const assignTenant = mutation({
//   args: {
//     unitId: v.id("units"),
//     tenantId: v.id("tenants"),
//   },

//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.unitId, {
//       currentTenantId: args.tenantId,
//       status: "occupied",
//     });

//     return true;
//   },
// });

// // -----------------------------------------------------
// // 6. Vacate Unit (move-out)
// // -----------------------------------------------------
// export const vacateUnit = mutation({
//   args: { unitId: v.id("units") },

//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.unitId, {
//       currentTenantId: undefined,
//       status: "vacant",
//     });

//     return true;
//   },
// });

// // -----------------------------------------------------
// // 7. Delete unit
// // -----------------------------------------------------
// export const deleteUnit = mutation({
//   args: { id: v.id("units") },

//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//     return true;
//   },
// });


// export const deleteSession = mutation({
//   args: { token: v.string() },
//   handler: async (ctx, args) => {
//     const session = await ctx.db
//       .query("tenantSessions")
//       .withIndex("by_token", (q) => q.eq("token", args.token))
//       .first();

//     if (session) {
//       await ctx.db.delete(session._id);
//     }
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
   Helper: Get companyId from auth
------------------------------------------------------ */
// async function getCompanyId(ctx: any) {
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity) throw new Error("Unauthorized");
//   return identity.subject; // companyId
// }

async function getCompanyId(ctx: any) {
  // TEMPORARY DEV MODE: always use your known company
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}


/* -----------------------------------------------------
   0. Get ALL units for the logged in company
------------------------------------------------------ */
export const getAllUnits = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("units")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   1. Create Unit
------------------------------------------------------ */
// export const createUnit = mutation({
//   args: {
//     propertyId: v.id("properties"),

//     unitNumber: v.string(),
//     type: v.string(),
//     size: v.optional(v.string()),
//     floor: v.optional(v.number()),

//     baseRent: v.number(),
//     status: v.string(), // vacant, occupied, maintenance

//     notes: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

//     // ensure property belongs to same company
//     const property = await ctx.db.get(args.propertyId);
//     if (!property || property.companyId !== companyId)
//       throw new Error("Invalid property");

//     return await ctx.db.insert("units", {
//       ...args,
//       companyId,
//       currentTenantId: undefined,
//       createdAt: new Date().toISOString(),
//     });
//   },
// });
export const createUnit = mutation({
  args: {
    propertyId: v.id("properties"),

    unitNumber: v.string(),
    type: v.string(),
    size: v.optional(v.string()),
    floor: v.optional(v.number()),

    baseRent: v.number(),
    status: v.string(), // vacant, occupied, maintenance

    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    // ---------------------------------------------------
    // Validate: Property must belong to the same company
    // ---------------------------------------------------
    const property = await ctx.db.get(args.propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied. Property does not belong to your company.");
    }

    // ---------------------------------------------------
    // Insert Unit
    // ---------------------------------------------------
    return await ctx.db.insert("units", {
      ...args,
      companyId,             // 🔥 Critical for isolation
      currentTenantId: undefined,
      createdAt: new Date().toISOString(),
    });
  },
});

/* -----------------------------------------------------
   2. Get all units for a property
------------------------------------------------------ */
export const getUnitsByProperty = query({
  args: { propertyId: v.id("properties") },

  handler: async (ctx, { propertyId }) => {
    const companyId = await getCompanyId(ctx);

    // verify property belongs to same company
    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId)
      return [];

    return await ctx.db
      .query("units")
      .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   3. Get unit by ID
------------------------------------------------------ */
export const getUnitById = query({
  args: { id: v.id("units") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const unit = await ctx.db.get(id);
    if (!unit || unit.companyId !== companyId) return null;

    return unit;
  },
});

/* -----------------------------------------------------
   4. Update Unit
------------------------------------------------------ */
export const updateUnit = mutation({
  args: {
    id: v.id("units"),
    updates: v.object({
      unitNumber: v.optional(v.string()),
      type: v.optional(v.string()),
      size: v.optional(v.string()),
      floor: v.optional(v.number()),
      baseRent: v.optional(v.number()),
      status: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { id, updates }) => {
    const companyId = await getCompanyId(ctx);

    const unit = await ctx.db.get(id);
    if (!unit || unit.companyId !== companyId)
      throw new Error("Unauthorized");

    await ctx.db.patch(id, updates);

    return true;
  },
});

/* -----------------------------------------------------
   5. Assign Tenant (move-in)
------------------------------------------------------ */
export const assignTenant = mutation({
  args: {
    unitId: v.id("units"),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, { unitId, tenantId }) => {
    const companyId = await getCompanyId(ctx);

    const unit = await ctx.db.get(unitId);
    const tenant = await ctx.db.get(tenantId);

    if (!unit || unit.companyId !== companyId) throw new Error("Unauthorized");
    if (!tenant || tenant.companyId !== companyId) throw new Error("Unauthorized");

    await ctx.db.patch(unitId, {
      currentTenantId: tenantId,
      status: "occupied",
    });

    return true;
  },
});

/* -----------------------------------------------------
   6. Vacate Unit
------------------------------------------------------ */
export const vacateUnit = mutation({
  args: { unitId: v.id("units") },

  handler: async (ctx, { unitId }) => {
    const companyId = await getCompanyId(ctx);

    const unit = await ctx.db.get(unitId);
    if (!unit || unit.companyId !== companyId)
      throw new Error("Unauthorized");

    await ctx.db.patch(unitId, {
      currentTenantId: undefined,
      status: "vacant",
    });

    return true;
  },
});

/* -----------------------------------------------------
   7. Delete Unit
------------------------------------------------------ */
export const deleteUnit = mutation({
  args: { id: v.id("units") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const unit = await ctx.db.get(id);
    if (!unit || unit.companyId !== companyId)
      throw new Error("Unauthorized");

    await ctx.db.delete(id);
    return true;
  },
});
