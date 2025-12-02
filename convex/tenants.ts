import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
   1. Create Tenant + Move-in
------------------------------------------------------ */
export const createTenant = mutation({
  args: {
    propertyId: v.id("properties"),
    unitId: v.id("units"),

    name: v.string(),
    phone: v.string(),
    email: v.string(),
    dob: v.optional(v.string()),

    profileImage: v.optional(v.string()),

    leaseStart: v.string(),
    leaseEnd: v.optional(v.string()),
    deposit: v.number(),

    rentAmount: v.number(),
    rentFrequency: v.string(), // monthly

    status: v.string(), // active / vacated / pending

    notes: v.optional(
      v.array(
        v.object({
          message: v.string(),
          createdAt: v.string(),
        })
      )
    ),

    documents: v.optional(
      v.array(
        v.object({
          type: v.string(),
          url: v.string(),
          uploadedAt: v.string(),
        })
      )
    ),
  },

  handler: async (ctx, args) => {
    const tenantId = await ctx.db.insert("tenants", {
      ...args,
      createdAt: new Date().toISOString(),
    });

    // Mark unit as occupied
    await ctx.db.patch(args.unitId, {
      currentTenantId: tenantId,
      status: "occupied",
    });

    return tenantId;
  },
});

/* -----------------------------------------------------
   2. Get all tenants
------------------------------------------------------ */
export const getTenants = query({
  handler: async (ctx) => {
    return await ctx.db.query("tenants").order("desc").collect();
  },
});

/* -----------------------------------------------------
   3. Get tenants by property
------------------------------------------------------ */
export const getTenantsByProperty = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenants")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   4. Get tenant by ID
------------------------------------------------------ */
export const getTenantById = query({
  args: { id: v.id("tenants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/* -----------------------------------------------------
   5. Update tenant
------------------------------------------------------ */
export const updateTenant = mutation({
  args: {
    id: v.id("tenants"),
    updates: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      dob: v.optional(v.string()),

      profileImage: v.optional(v.string()),

      leaseStart: v.optional(v.string()),
      leaseEnd: v.optional(v.string()),
      deposit: v.optional(v.number()),

      rentAmount: v.optional(v.number()),
      rentFrequency: v.optional(v.string()),

      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
    return true;
  },
});

/* -----------------------------------------------------
   6. Add tenant document
------------------------------------------------------ */
export const addDocument = mutation({
  args: {
    tenantId: v.id("tenants"),
    type: v.string(),
    url: v.string(),
  },

  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.tenantId);

    const updated = [
      ...(tenant?.documents ?? []),
      {
        type: args.type,
        url: args.url,
        uploadedAt: new Date().toISOString(),
      },
    ];

    await ctx.db.patch(args.tenantId, { documents: updated });

    return true;
  },
});

/* -----------------------------------------------------
   7. Add note to tenant
------------------------------------------------------ */
export const addNote = mutation({
  args: {
    tenantId: v.id("tenants"),
    message: v.string(),
  },

  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.tenantId);

    const updated = [
      ...(tenant?.notes ?? []),
      {
        message: args.message,
        createdAt: new Date().toISOString(),
      },
    ];

    await ctx.db.patch(args.tenantId, { notes: updated });

    return true;
  },
});

/* -----------------------------------------------------
   8. Move out tenant
------------------------------------------------------ */
export const moveOutTenant = mutation({
  args: {
    tenantId: v.id("tenants"),
    unitId: v.id("units"),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.tenantId, {
      status: "vacated",
      leaseEnd: new Date().toISOString(),
    });

    await ctx.db.patch(args.unitId, {
      currentTenantId: undefined,
      status: "vacant",
    });

    return true;
  },
});

/* -----------------------------------------------------
   9. Delete tenant
------------------------------------------------------ */
export const deleteTenant = mutation({
  args: { id: v.id("tenants") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

/* -----------------------------------------------------
   10. Get all tenants (alias)
------------------------------------------------------ */
export const getAllTenants = query({
  handler: async (ctx) => {
    return await ctx.db.query("tenants").order("desc").collect();
  },
});
