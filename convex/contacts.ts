// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const getContactsByType = query({
//   args: { type: v.string() },
//   handler: async (ctx, { type }) => {
//     return await ctx.db
//       .query("contacts")
//       .withIndex("by_type", (q) => q.eq("type", type))
//       .collect();
//   },
// });

// export const createContact = mutation({
//   args: {
//     type: v.string(),
//     name: v.string(),
//     phone: v.string(),
//     email: v.string(),
//     propertyId: v.optional(v.id("properties")),
//     unitId: v.optional(v.id("units")),
//     notes: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("contacts", {
//       ...args,
//       createdAt: Date.now(),
//     });
//   },
// });

// export const updateContact = mutation({
//   args: {
//     id: v.id("contacts"),
//     updates: v.object({
//       name: v.optional(v.string()),
//       phone: v.optional(v.string()),
//       email: v.optional(v.string()),
//       notes: v.optional(v.string()),
//     }),
//   },
//   handler: async (ctx, { id, updates }) => {
//     await ctx.db.patch(id, updates);
//   },
// });

// export const deleteContact = mutation({
//   args: { id: v.id("contacts") },
//   handler: async (ctx, { id }) => {
//     await ctx.db.delete(id);
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ---------------------------------------------------------
    Helper: Get current companyId from auth
--------------------------------------------------------- */
// async function getCompanyId(ctx: any) {
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity || !identity.subject) {
//     throw new Error("Unauthorized");
//   }
//   return identity.subject; // companyId == manager.authId
// }

async function getCompanyId(ctx: any) {
  // TEMPORARY DEV MODE: always use your known company
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}




/* ---------------------------------------------------------
    1. Get Contacts by Type (Filtered by company)
--------------------------------------------------------- */
export const getContactsByType = query({
  args: { type: v.string() },

  handler: async (ctx, { type }) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("contacts")
      .withIndex("by_type", (q) => q.eq("type", type))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();
  },
});

/* ---------------------------------------------------------
    2. Create Contact (Auto attaches companyId)
--------------------------------------------------------- */
// export const createContact = mutation({
//   args: {
//     type: v.string(),
//     name: v.string(),
//     phone: v.string(),
//     email: v.string(),
//     propertyId: v.optional(v.id("properties")),
//     unitId: v.optional(v.id("units")),
//     notes: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

//     await ctx.db.insert("contacts", {
//       ...args,
//       companyId,
//       createdAt: Date.now(),
//     });
//   },
// });
export const createContact = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    propertyId: v.optional(v.id("properties")),
    unitId: v.optional(v.id("units")),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    await ctx.db.insert("contacts", {
      ...args,
      companyId,
      createdAt: Date.now(),
    });
  },
});

/* ---------------------------------------------------------
    3. Update Contact (Allowed only if same company)
--------------------------------------------------------- */
export const updateContact = mutation({
  args: {
    id: v.id("contacts"),
    updates: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
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
  },
});

/* ---------------------------------------------------------
    4. Delete Contact (Allowed only if same company)
--------------------------------------------------------- */
export const deleteContact = mutation({
  args: { id: v.id("contacts") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);

    const existing = await ctx.db.get(id);
    if (!existing || existing.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(id);
  },
});
