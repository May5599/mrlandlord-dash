import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getContactsByType = query({
  args: { type: v.string() },
  handler: async (ctx, { type }) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_type", (q) => q.eq("type", type))
      .collect();
  },
});

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
    await ctx.db.insert("contacts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

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
    await ctx.db.patch(id, updates);
  },
});

export const deleteContact = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
