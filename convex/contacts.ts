
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";

/* -----------------------------------------------------
   CREATE CONTACT
------------------------------------------------------ */
export const createContact = mutation({
  args: {
    token: v.string(),

    type: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),

    propertyId: v.optional(v.id("properties")),
    unitId: v.optional(v.id("units")),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromToken(ctx, args.token);

    return await ctx.db.insert("contacts", {
      companyId,
      type: args.type,
      name: args.name,
      phone: args.phone,
      email: args.email,
      propertyId: args.propertyId,
      unitId: args.unitId,
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});

/* -----------------------------------------------------
   GET CONTACTS BY TYPE
------------------------------------------------------ */
export const getContactsByType = query({
  args: {
    token: v.string(),
    type: v.string(),
  },

  handler: async (ctx, { token, type }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    return await ctx.db
      .query("contacts")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("type"), type))
      .collect();
  },
});

/* -----------------------------------------------------
   UPDATE CONTACT
------------------------------------------------------ */
export const updateContact = mutation({
  args: {
    token: v.string(),
    id: v.id("contacts"),
    updates: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { token, id, updates }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const contact = await ctx.db.get(id);

    if (!contact || contact.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, updates);
    return true;
  },
});

/* -----------------------------------------------------
   DELETE CONTACT
------------------------------------------------------ */
export const deleteContact = mutation({
  args: {
    token: v.string(),
    id: v.id("contacts"),
  },

  handler: async (ctx, { token, id }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);
    const contact = await ctx.db.get(id);

    if (!contact || contact.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);
    return true;
  },
});
