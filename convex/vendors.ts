// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const addVendor = mutation({
//   args: {
//     name: v.string(),
//     phone: v.string(),
//     email: v.optional(v.string()),
//     specialty: v.optional(v.string()),
//     createdAt: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert("vendors", args);
//   },
// });

// export const getVendors = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("vendors").order("desc").collect();
//   },
// });

// export const deleteVendor = mutation({
//   args: { id: v.id("vendors") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//     return true;
//   },
// });


// export const getVendorById = query({
//   args: { id: v.id("vendors") },
//   handler: async (ctx, args) => {
//     return ctx.db.get(args.id);
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
   Helper — Get companyId from logged in manager
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
   1. Add Vendor
------------------------------------------------------ */
// export const addVendor = mutation({
//   args: {
//     name: v.string(),
//     phone: v.string(),
//     email: v.optional(v.string()),
//     specialty: v.optional(v.string()),
//     createdAt: v.string(),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

//     return await ctx.db.insert("vendors", {
//       ...args,
//       companyId,
//     });
//   },
// });
export const addVendor = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    specialty: v.optional(v.string()),
    createdAt: v.string(),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx); // 🔥 identifies which company is adding the vendor

    return await ctx.db.insert("vendors", {
      ...args,
      companyId,     // 🔥 ensures vendor is isolated to this company
    });
  },
});

/* -----------------------------------------------------
   2. Get Vendors for Logged in Company
------------------------------------------------------ */
export const getVendors = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("vendors")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   3. Delete Vendor (company scoped)
------------------------------------------------------ */
export const deleteVendor = mutation({
  args: { id: v.id("vendors") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const vendor = await ctx.db.get(id);
    if (!vendor || vendor.companyId !== companyId)
      throw new Error("Unauthorized");

    await ctx.db.delete(id);
    return true;
  },
});

/* -----------------------------------------------------
   4. Get Vendor By ID (company scoped)
------------------------------------------------------ */
export const getVendorById = query({
  args: { id: v.id("vendors") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const vendor = await ctx.db.get(id);
    if (!vendor || vendor.companyId !== companyId) return null;

    return vendor;
  },
});
