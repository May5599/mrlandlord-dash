// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";


// // -----------------------------------------------------
// // 1. Create Property
// // -----------------------------------------------------
// export const createProperty = mutation({
//   args: {
//     name: v.string(),
//     type: v.optional(v.string()),
//     address: v.string(),
//     city: v.string(),
//     state: v.optional(v.string()),
//     postalCode: v.string(),
//     country: v.string(),

//     ownerName: v.optional(v.string()),
//     ownerPhone: v.optional(v.string()),
//     ownerEmail: v.optional(v.string()),

//     managerName: v.optional(v.string()),
//     managerPhone: v.optional(v.string()),
//     managerEmail: v.optional(v.string()),

//     notes: v.optional(v.string())
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert("properties", {
//       ...args,
//       createdAt: new Date().toISOString()
//     });
//   },
// });

// // -----------------------------------------------------
// // 2. Get All Properties
// // -----------------------------------------------------
// export const getAllProperties = query({
//   handler: async (ctx) => {
//     return await ctx.db
//       .query("properties")
//       .order("desc")
//       .collect();
//   },
// });

// // -----------------------------------------------------
// // 3. Get Single Property
// // -----------------------------------------------------
// export const getPropertyById = query({
//   args: { id: v.id("properties") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });

// // -----------------------------------------------------
// // 4. Update Property
// // -----------------------------------------------------
// export const updateProperty = mutation({
//   args: {
//     id: v.id("properties"),
//     updates: v.object({
//       name: v.optional(v.string()),
//       type: v.optional(v.string()),
//       address: v.optional(v.string()),
//       city: v.optional(v.string()),
//       state: v.optional(v.string()),
//       postalCode: v.optional(v.string()),
//       country: v.optional(v.string()),

//       ownerName: v.optional(v.string()),
//       ownerPhone: v.optional(v.string()),
//       ownerEmail: v.optional(v.string()),

//       managerName: v.optional(v.string()),
//       managerPhone: v.optional(v.string()),
//       managerEmail: v.optional(v.string()),

//       notes: v.optional(v.string()),
//     })
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, args.updates);
//     return true;
//   },
// });

// // -----------------------------------------------------
// // 5. Delete Property
// // -----------------------------------------------------
// export const deleteProperty = mutation({
//   args: { id: v.id("properties") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//     return true;
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
    Helper: Get companyId from auth session
----------------------------------------------------- */
// 

async function getCompanyId(ctx: any) {
  // TEMPORARY DEV MODE: always use your known company
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}






/* -----------------------------------------------------
    1. Create Property   (auto attach companyId)
----------------------------------------------------- */
// export const createProperty = mutation({
//   args: {
//     companyId: v.id("companies"),
//     name: v.string(),
//     type: v.optional(v.string()),
//     address: v.string(),
//     city: v.string(),
//     state: v.optional(v.string()),
//     postalCode: v.string(),
//     country: v.string(),

//     ownerName: v.optional(v.string()),
//     ownerPhone: v.optional(v.string()),
//     ownerEmail: v.optional(v.string()),

//     managerName: v.optional(v.string()),
//     managerPhone: v.optional(v.string()),
//     managerEmail: v.optional(v.string()),

//     notes: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

//     return await ctx.db.insert("properties", {
//       ...args,
//       companyId,
//       createdAt: new Date().toISOString(),
//     });
//   },
// });

export const createProperty = mutation({
  args: {
    name: v.string(),
    type: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    state: v.optional(v.string()),
    postalCode: v.string(),
    country: v.string(),

    ownerName: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),

    managerName: v.optional(v.string()),
    managerPhone: v.optional(v.string()),
    managerEmail: v.optional(v.string()),

    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db.insert("properties", {
      ...args,
      companyId,
      createdAt: new Date().toISOString(),
    });
  },
});


/* -----------------------------------------------------
    2. Get All Properties (company-filtered)
----------------------------------------------------- */
export const getAllProperties = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("properties")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
    3. Get Single Property (company restricted)
----------------------------------------------------- */
export const getPropertyById = query({
  args: { id: v.id("properties") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const property = await ctx.db.get(id);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return property;
  },
});

/* -----------------------------------------------------
    4. Update Property (company restricted)
----------------------------------------------------- */
export const updateProperty = mutation({
  args: {
    id: v.id("properties"),
    updates: v.object({
      name: v.optional(v.string()),
      type: v.optional(v.string()),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      country: v.optional(v.string()),

      ownerName: v.optional(v.string()),
      ownerPhone: v.optional(v.string()),
      ownerEmail: v.optional(v.string()),

      managerName: v.optional(v.string()),
      managerPhone: v.optional(v.string()),
      managerEmail: v.optional(v.string()),

      notes: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { id, updates }) => {
    const companyId = await getCompanyId(ctx);

    const existing = await ctx.db.get(id);
    if (!existing || existing.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(id, updates);
    return true;
  },
});

/* -----------------------------------------------------
    5. Delete Property (company restricted)
----------------------------------------------------- */
export const deleteProperty = mutation({
  args: { id: v.id("properties") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const existing = await ctx.db.get(id);
    if (!existing || existing.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(id);
    return true;
  },
});
