
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromSession } from "./_lib/auth";

/* -----------------------------------------------------
    CREATE PROPERTY
----------------------------------------------------- */
export const createProperty = mutation({
  args: {
    token: v.string(),
    
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
    const companyId = await getCompanyIdFromSession(ctx, args.token);

    return ctx.db.insert("properties", {
      companyId,
      name: args.name,
      type: args.type,
      address: args.address,
      city: args.city,
      state: args.state,
      postalCode: args.postalCode,
      country: args.country,
      ownerName: args.ownerName,
      ownerPhone: args.ownerPhone,
      ownerEmail: args.ownerEmail,
      managerName: args.managerName,
      managerPhone: args.managerPhone,
      managerEmail: args.managerEmail,
      notes: args.notes,
      createdAt: new Date().toISOString(),
    });
  },
});

/* -----------------------------------------------------
    GET ALL PROPERTIES
----------------------------------------------------- */
export const getAllProperties = query({
  args: {
    token: v.string(),  // ✅ REQUIRED
  },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    return ctx.db
      .query("properties")
      .withIndex("by_company", q => q.eq("companyId", companyId))
      .collect();
  },
});


/* -----------------------------------------------------
    GET PROPERTY BY ID
----------------------------------------------------- */
export const getPropertyById = query({
  args: {
    token: v.string(),
    propertyId: v.id("properties"),
  },

  handler: async (ctx, { token, propertyId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return property;
  },
});

/* -----------------------------------------------------
    UPDATE PROPERTY
----------------------------------------------------- */
export const updateProperty = mutation({
  args: {
    token: v.string(),
    propertyId: v.id("properties"),
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

  handler: async (ctx, { token, propertyId, updates }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(propertyId, updates);
    return true;
  },
});

/* -----------------------------------------------------
    DELETE PROPERTY
----------------------------------------------------- */
export const deleteProperty = mutation({
  args: {
    token: v.string(),
    propertyId: v.id("properties"),
  },

  handler: async (ctx, { token, propertyId }) => {
    const companyId = await getCompanyIdFromSession(ctx, token);

    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(propertyId);
    return true;
  },
});