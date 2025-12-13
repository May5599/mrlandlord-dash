// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// /* -----------------------------------------------------
//    1. Create Tenant + Move-in
// ------------------------------------------------------ */
// export const createTenant = mutation({
//   args: {
//     propertyId: v.id("properties"),
//     unitId: v.id("units"),

//     name: v.string(),
//     phone: v.string(),
//     email: v.string(),
//     dob: v.optional(v.string()),

//     profileImage: v.optional(v.string()),

//     leaseStart: v.string(),
//     leaseEnd: v.optional(v.string()),
//     deposit: v.number(),

//     rentAmount: v.number(),
//     rentFrequency: v.string(), // monthly

//     status: v.string(), // active / vacated / pending

//     notes: v.optional(
//       v.array(
//         v.object({
//           message: v.string(),
//           createdAt: v.string(),
//         })
//       )
//     ),

//     documents: v.optional(
//       v.array(
//         v.object({
//           type: v.string(),
//           url: v.string(),
//           uploadedAt: v.string(),
//         })
//       )
//     ),
//   },

//   handler: async (ctx, args) => {
//     const tenantId = await ctx.db.insert("tenants", {
//       ...args,
//       createdAt: new Date().toISOString(),
//     });

//     // Mark unit as occupied
//     await ctx.db.patch(args.unitId, {
//       currentTenantId: tenantId,
//       status: "occupied",
//     });

//     return tenantId;
//   },
// });

// /* -----------------------------------------------------
//    2. Get all tenants
// ------------------------------------------------------ */
// export const getTenants = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("tenants").order("desc").collect();
//   },
// });

// /* -----------------------------------------------------
//    3. Get tenants by property
// ------------------------------------------------------ */
// export const getTenantsByProperty = query({
//   args: { propertyId: v.id("properties") },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("tenants")
//       .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
//       .order("desc")
//       .collect();
//   },
// });

// /* -----------------------------------------------------
//    4. Get tenant by ID
// ------------------------------------------------------ */
// export const getTenantById = query({
//   args: { id: v.id("tenants") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });

// /* -----------------------------------------------------
//    5. Update tenant
// ------------------------------------------------------ */
// export const updateTenant = mutation({
//   args: {
//     id: v.id("tenants"),
//     updates: v.object({
//       name: v.optional(v.string()),
//       phone: v.optional(v.string()),
//       email: v.optional(v.string()),
//       dob: v.optional(v.string()),

//       profileImage: v.optional(v.string()),

//       leaseStart: v.optional(v.string()),
//       leaseEnd: v.optional(v.string()),
//       deposit: v.optional(v.number()),

//       rentAmount: v.optional(v.number()),
//       rentFrequency: v.optional(v.string()),

//       status: v.optional(v.string()),
//     }),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, args.updates);
//     return true;
//   },
// });

// /* -----------------------------------------------------
//    6. Add tenant document
// ------------------------------------------------------ */
// export const addDocument = mutation({
//   args: {
//     tenantId: v.id("tenants"),
//     type: v.string(),
//     url: v.string(),
//   },

//   handler: async (ctx, args) => {
//     const tenant = await ctx.db.get(args.tenantId);

//     const updated = [
//       ...(tenant?.documents ?? []),
//       {
//         type: args.type,
//         url: args.url,
//         uploadedAt: new Date().toISOString(),
//       },
//     ];

//     await ctx.db.patch(args.tenantId, { documents: updated });

//     return true;
//   },
// });

// /* -----------------------------------------------------
//    7. Add note to tenant
// ------------------------------------------------------ */
// export const addNote = mutation({
//   args: {
//     tenantId: v.id("tenants"),
//     message: v.string(),
//   },

//   handler: async (ctx, args) => {
//     const tenant = await ctx.db.get(args.tenantId);

//     const updated = [
//       ...(tenant?.notes ?? []),
//       {
//         message: args.message,
//         createdAt: new Date().toISOString(),
//       },
//     ];

//     await ctx.db.patch(args.tenantId, { notes: updated });

//     return true;
//   },
// });

// /* -----------------------------------------------------
//    8. Move out tenant
// ------------------------------------------------------ */
// export const moveOutTenant = mutation({
//   args: {
//     tenantId: v.id("tenants"),
//     unitId: v.id("units"),
//   },

//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.tenantId, {
//       status: "vacated",
//       leaseEnd: new Date().toISOString(),
//     });

//     await ctx.db.patch(args.unitId, {
//       currentTenantId: undefined,
//       status: "vacant",
//     });

//     return true;
//   },
// });

// /* -----------------------------------------------------
//    9. Delete tenant
// ------------------------------------------------------ */
// export const deleteTenant = mutation({
//   args: { id: v.id("tenants") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//     return true;
//   },
// });

// /* -----------------------------------------------------
//    10. Get all tenants (alias)
// ------------------------------------------------------ */
// export const getAllTenants = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("tenants").order("desc").collect();
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
   Helper: get company from logged-in manager
------------------------------------------------------ */
// async function getCompanyId(ctx: any) {
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity) throw new Error("Unauthorized");
//   return identity.subject; // your company identifier
// }
async function getCompanyId(ctx: any) {
  // TEMPORARY DEV MODE: always use your known company
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}



/* -----------------------------------------------------
   1. Create Tenant + Move-in
------------------------------------------------------ */
// export const createTenant = mutation({
//   args: {
//     propertyId: v.id("properties"),
//     unitId: v.id("units"),

//     name: v.string(),
//     phone: v.string(),
//     email: v.string(),
//     dob: v.optional(v.string()),

//     profileImage: v.optional(v.string()),

//     leaseStart: v.string(),
//     leaseEnd: v.optional(v.string()),
//     deposit: v.number(),

//     rentAmount: v.number(),
//     rentFrequency: v.string(),

//     status: v.string(),

//     notes: v.optional(
//       v.array(
//         v.object({
//           message: v.string(),
//           createdAt: v.string(),
//         })
//       )
//     ),

//     documents: v.optional(
//       v.array(
//         v.object({
//           type: v.string(),
//           url: v.string(),
//           uploadedAt: v.string(),
//         })
//       )
//     ),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

//     // Validate property belongs to company
//     const property = await ctx.db.get(args.propertyId);
//     if (!property || property.companyId !== companyId) {
//       throw new Error("Access denied. Property not in your company.");
//     }

//     // Validate unit belongs to company
//     const unit = await ctx.db.get(args.unitId);
//     if (!unit || unit.companyId !== companyId) {
//       throw new Error("Access denied. Unit not in your company.");
//     }

//     // Insert tenant
//     const tenantId = await ctx.db.insert("tenants", {
//       ...args,
//       companyId,   // 🔥 important
//       createdAt: new Date().toISOString(),
//     });

//     // Update unit status
//     await ctx.db.patch(args.unitId, {
//       currentTenantId: tenantId,
//       status: "occupied",
//     });

//     return tenantId;
//   },
// });
export const createTenant = mutation({
  args: {
    propertyId: v.id("properties"),
    unitId: v.id("units"),

    name: v.string(),
    phone: v.string(),
    email: v.string(),
    dob: v.optional(v.string()),

    profileImage: v.optional(v.string()),

    leaseStart: v.string(),
    leaseEnd: v.optional(v.string()),
    deposit: v.number(),

    rentAmount: v.number(),
    rentFrequency: v.string(),

    status: v.string(),   // active | vacated | pending

    notes: v.optional(
      v.array(
        v.object({
          message: v.string(),
          createdAt: v.string(),
        })
      )
    ),

    documents: v.optional(
      v.array(
        v.object({
          type: v.string(),
          url: v.string(),
          uploadedAt: v.string(),
        })
      )
    ),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    // ---------------------------------------------------
    // Validate: Property must belong to this company
    // ---------------------------------------------------
    const property = await ctx.db.get(args.propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied. Property does not belong to your company.");
    }

    // ---------------------------------------------------
    // Validate: Unit must belong to this company
    // ---------------------------------------------------
    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied. Unit does not belong to your company.");
    }

    // ---------------------------------------------------
    // Create Tenant
    // ---------------------------------------------------
    const tenantId = await ctx.db.insert("tenants", {
      ...args,
      companyId,          // 🔥 Critical for multi-company isolation
      createdAt: new Date().toISOString(),
    });

    // ---------------------------------------------------
    // Update Unit (assign tenant)
    // ---------------------------------------------------
    await ctx.db.patch(args.unitId, {
      currentTenantId: tenantId,
      status: "occupied",
    });

    return tenantId;
  },
});

/* -----------------------------------------------------
   2. Get all tenants (company restricted)
------------------------------------------------------ */
export const getTenants = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   3. Get tenants by property
------------------------------------------------------ */
export const getTenantsByProperty = query({
  args: { propertyId: v.id("properties") },

  handler: async (ctx, { propertyId }) => {
    const companyId = await getCompanyId(ctx);

    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    return await ctx.db
      .query("tenants")
      .withIndex("by_property", (q) => q.eq("propertyId", propertyId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   4. Get tenant by ID
------------------------------------------------------ */
export const getTenantById = query({
  args: { id: v.id("tenants") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(id);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    return tenant;
  },
});

/* -----------------------------------------------------
   5. Update tenant
------------------------------------------------------ */
export const updateTenant = mutation({
  args: {
    id: v.id("tenants"),
    updates: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      dob: v.optional(v.string()),
      profileImage: v.optional(v.string()),
      leaseStart: v.optional(v.string()),
      leaseEnd: v.optional(v.string()),
      deposit: v.optional(v.number()),
      rentAmount: v.optional(v.number()),
      rentFrequency: v.optional(v.string()),
      status: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { id, updates }) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(id);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    await ctx.db.patch(id, updates);
    return true;
  },
});

/* -----------------------------------------------------
   6. Add document
------------------------------------------------------ */
export const addDocument = mutation({
  args: {
    tenantId: v.id("tenants"),
    type: v.string(),
    url: v.string(),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    const updated = [
      ...(tenant?.documents ?? []),
      {
        type: args.type,
        url: args.url,
        uploadedAt: new Date().toISOString(),
      },
    ];

    await ctx.db.patch(args.tenantId, { documents: updated });

    return true;
  },
});

/* -----------------------------------------------------
   7. Add note
------------------------------------------------------ */
export const addNote = mutation({
  args: {
    tenantId: v.id("tenants"),
    message: v.string(),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    const updated = [
      ...(tenant?.notes ?? []),
      {
        message: args.message,
        createdAt: new Date().toISOString(),
      },
    ];

    await ctx.db.patch(args.tenantId, { notes: updated });
    return true;
  },
});

/* -----------------------------------------------------
   8. Move out tenant
------------------------------------------------------ */
export const moveOutTenant = mutation({
  args: {
    tenantId: v.id("tenants"),
    unitId: v.id("units"),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    const unit = await ctx.db.get(args.unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    await ctx.db.patch(args.tenantId, {
      status: "vacated",
      leaseEnd: new Date().toISOString(),
    });

    await ctx.db.patch(args.unitId, {
      currentTenantId: undefined,
      status: "vacant",
    });

    return true;
  },
});

/* -----------------------------------------------------
   9. Delete tenant
------------------------------------------------------ */
export const deleteTenant = mutation({
  args: { id: v.id("tenants") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(id);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    await ctx.db.delete(id);
    return true;
  },
});

/* -----------------------------------------------------
   10. Get all tenants (alias)
------------------------------------------------------ */
export const getAllTenants = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});
