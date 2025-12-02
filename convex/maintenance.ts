import { mutation, query } from "./_generated/server";
import { v } from "convex/values";




export const deleteRequest = mutation({
  args: { id: v.id("maintenance") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// -----------------------------------------------------
// 1. Create maintenance request
// -----------------------------------------------------
export const createMaintenance = mutation({
  args: {
    propertyId: v.id("properties"),
    unitId: v.id("units"),
    tenantId: v.optional(v.id("tenants")),

    title: v.string(),
    description: v.string(),
    priority: v.string(), // low, medium, high
    images: v.optional(v.array(v.string()))
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("maintenance", {
      ...args,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: undefined
    });
  },
});

// -----------------------------------------------------
// 2. Get all maintenance for a property
// -----------------------------------------------------
export const getMaintenanceByProperty = query({
  args: { propertyId: v.id("properties") },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("maintenance")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .order("desc")
      .collect();
  },
});

// -----------------------------------------------------
// 3. Get maintenance by status (for dashboard)
// -----------------------------------------------------
export const getMaintenanceByStatus = query({
  args: { status: v.string() },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("maintenance")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// -----------------------------------------------------
// 4. Get a single maintenance request
// -----------------------------------------------------
export const getMaintenanceById = query({
  args: { id: v.id("maintenance") },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// -----------------------------------------------------
// 5. Update maintenance (status, cost, notes, etc.)
// -----------------------------------------------------
export const updateMaintenance = mutation({
  args: {
    id: v.id("maintenance"),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      priority: v.optional(v.string()),
      status: v.optional(v.string()),
      cost: v.optional(v.number()),
      images: v.optional(v.array(v.string()))
    })
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: new Date().toISOString()
    });

    return true;
  },
});

// -----------------------------------------------------
// 6. Delete maintenance request
// -----------------------------------------------------
export const deleteMaintenance = mutation({
  args: { id: v.id("maintenance") },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },

  
});


export const createRequest = mutation({
  args: {
    tenantId: v.id("tenants"),
    propertyId: v.id("properties"),
    unitId: v.id("units"),
    title: v.string(),
    description: v.string(),
    priority: v.string(), // low, medium, high
    images: v.optional(v.array(v.string())),
  },

  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("maintenance", {
      ...args,
      status: "open",
      cost: undefined,
      createdAt: new Date().toISOString(),
    });

    return requestId;
  },
});

// Managers fetch all requests
export const getAllRequests = query({
  handler: async (ctx) => {
    return await ctx.db.query("maintenance").order("desc").collect();
  },
});