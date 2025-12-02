import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


// Get all units
export const getAllUnits = query({
  handler: async (ctx) => {
    return await ctx.db.query("units").order("desc").collect();
  },
});
// -----------------------------------------------------
// 1. Create Unit
// -----------------------------------------------------
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
    return await ctx.db.insert("units", {
      ...args,
      currentTenantId: undefined,
      createdAt: new Date().toISOString(),
    });
  },
});

// -----------------------------------------------------
// 2. Get all units for a property
// -----------------------------------------------------
export const getUnitsByProperty = query({
  args: { propertyId: v.id("properties") },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("units")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .order("desc")
      .collect();
  },
});

// -----------------------------------------------------
// 3. Get single unit
// -----------------------------------------------------
export const getUnitById = query({
  args: { id: v.id("units") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// -----------------------------------------------------
// 4. Update unit
// -----------------------------------------------------
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

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...args.updates,
    });

    return true;
  },
});

// -----------------------------------------------------
// 5. Assign Tenant (move-in)
// -----------------------------------------------------
export const assignTenant = mutation({
  args: {
    unitId: v.id("units"),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.unitId, {
      currentTenantId: args.tenantId,
      status: "occupied",
    });

    return true;
  },
});

// -----------------------------------------------------
// 6. Vacate Unit (move-out)
// -----------------------------------------------------
export const vacateUnit = mutation({
  args: { unitId: v.id("units") },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.unitId, {
      currentTenantId: undefined,
      status: "vacant",
    });

    return true;
  },
});

// -----------------------------------------------------
// 7. Delete unit
// -----------------------------------------------------
export const deleteUnit = mutation({
  args: { id: v.id("units") },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
