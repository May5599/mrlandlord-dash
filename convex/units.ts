import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromSession } from "./_lib/auth";

/* -----------------------------------------------------
   GET ALL UNITS (COMPANY)
------------------------------------------------------ */
// export const getAllUnits = query({
//   args: { token: v.string() },

//   handler: async (ctx, { token }) => {
//     const companyId = await getCompanyIdFromSession(ctx, token);

//     return ctx.db
//       .query("units")
//       .withIndex("by_company", q => q.eq("companyId", companyId))
//       .collect();
//   },
// });
export const getAllUnits = query({
  args: {
    token: v.optional(v.string()),
  },

  handler: async (ctx, { token }) => {
    if (!token) return [];

    const companyId = await getCompanyIdFromSession(ctx, token);

    return ctx.db
      .query("units")
      .withIndex("by_company", q => q.eq("companyId", companyId))
      .collect();
  },
});

/* -----------------------------------------------------
   CREATE UNIT
------------------------------------------------------ */
export const createUnit = mutation({
  args: {
    token: v.string(),

    propertyId: v.id("properties"),
    unitNumber: v.string(),
    type: v.string(),
    size: v.optional(v.string()),
    floor: v.optional(v.number()),
    baseRent: v.number(),
    status: v.string(), // vacant | occupied | maintenance
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromSession(ctx, args.token);

    const property = await ctx.db.get(args.propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return ctx.db.insert("units", {
      companyId,
      propertyId: args.propertyId,
      unitNumber: args.unitNumber,
      type: args.type,
      size: args.size,
      floor: args.floor,
      baseRent: args.baseRent,
      status: args.status,
      notes: args.notes,
      currentTenantId: undefined,
      createdAt: new Date().toISOString(),
    });
  },
});

/* -----------------------------------------------------
   GET UNITS BY PROPERTY
------------------------------------------------------ */
export const getUnitsByProperty = query({
  args: {
    token: v.string(),
    propertyId: v.id("properties"),
  },

  handler: async (ctx, { token, propertyId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId) return [];

    return ctx.db
      .query("units")
      .withIndex("by_property", q => q.eq("propertyId", propertyId))
      .filter(q => q.eq(q.field("companyId"), companyId))
      .collect();
  },
});

/* -----------------------------------------------------
   GET UNIT BY ID
------------------------------------------------------ */
export const getUnitById = query({
  args: {
    token: v.string(),
    unitId: v.id("units"),
  },

  handler: async (ctx, { token, unitId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const unit = await ctx.db.get(unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return unit;
  },
});

/* -----------------------------------------------------
   UPDATE UNIT
------------------------------------------------------ */
export const updateUnit = mutation({
  args: {
    token: v.string(),
    unitId: v.id("units"),
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

  handler: async (ctx, { token, unitId, updates }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const unit = await ctx.db.get(unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(unitId, updates);
    return true;
  },
});

/* -----------------------------------------------------
   ASSIGN TENANT (MOVE IN)
------------------------------------------------------ */
export const assignTenant = mutation({
  args: {
    token: v.string(),
    unitId: v.id("units"),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, { token, unitId, tenantId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const unit = await ctx.db.get(unitId);
    const tenant = await ctx.db.get(tenantId);

    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied");
    }

    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(unitId, {
      currentTenantId: tenantId,
      status: "occupied",
    });

    return true;
  },
});

/* -----------------------------------------------------
   VACATE UNIT (MOVE OUT)
------------------------------------------------------ */
export const vacateUnit = mutation({
  args: {
    token: v.string(),
    unitId: v.id("units"),
  },

  handler: async (ctx, { token, unitId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const unit = await ctx.db.get(unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(unitId, {
      currentTenantId: undefined,
      status: "vacant",
    });

    return true;
  },
});

/* -----------------------------------------------------
   DELETE UNIT
------------------------------------------------------ */
export const deleteUnit = mutation({
  args: {
    token: v.string(),
    unitId: v.id("units"),
  },

  handler: async (ctx, { token, unitId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const unit = await ctx.db.get(unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(unitId);
    return true;
  },
});
