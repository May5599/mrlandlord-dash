import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


// -----------------------------------------------------
// 1. Create Property
// -----------------------------------------------------
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

    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("properties", {
      ...args,
      createdAt: new Date().toISOString()
    });
  },
});

// -----------------------------------------------------
// 2. Get All Properties
// -----------------------------------------------------
export const getAllProperties = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("properties")
      .order("desc")
      .collect();
  },
});

// -----------------------------------------------------
// 3. Get Single Property
// -----------------------------------------------------
export const getPropertyById = query({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// -----------------------------------------------------
// 4. Update Property
// -----------------------------------------------------
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
    })
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
    return true;
  },
});

// -----------------------------------------------------
// 5. Delete Property
// -----------------------------------------------------
export const deleteProperty = mutation({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
