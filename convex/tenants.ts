import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";
import { sendTenantWelcomeEmail, sendTenantMovedOutEmail } from "./_lib/emailService";
import { insertNotification } from "./_lib/notificationHelpers";


/* ---------------------------------
   CREATE TENANT
---------------------------------- */
export const createTenant = mutation({
  args: {
    token: v.string(),
    passwordHash: v.string(),

    propertyId: v.id("properties"),
    unitId: v.id("units"),

    name: v.string(),
    phone: v.string(),
    email: v.string(),
    dob: v.optional(v.string()),

    leaseStart: v.string(),
    leaseEnd: v.optional(v.string()),

    rentAmount: v.number(),
    rentFrequency: v.union(v.literal("monthly")),
    deposit: v.number(),

    status: v.union(
  v.literal("active"),
  v.literal("pending"),
  v.literal("vacated")
),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyIdFromToken(ctx, args.token);

    const [property, unit, company] = await Promise.all([
      ctx.db.get(args.propertyId),
      ctx.db.get(args.unitId),
      ctx.db.get(companyId),
    ]);
    if (!property || property.companyId !== companyId) {
      throw new Error("Invalid property access");
    }
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Invalid unit access");
    }

    const tenantId = await ctx.db.insert("tenants", {
      companyId,
      propertyId: args.propertyId,
      unitId: args.unitId,

      name: args.name,
      phone: args.phone,
      email: args.email,
      dob: args.dob,


      passwordHash: args.passwordHash,
      onboardingStatus: "pending_setup",

      leaseStart: args.leaseStart,
      leaseEnd: args.leaseEnd,

      rentAmount: args.rentAmount,
      rentFrequency: args.rentFrequency,
      deposit: args.deposit,

      status: args.status,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.unitId, {
      currentTenantId: tenantId,
      status: "occupied",
    });

    // Welcome email to tenant
    try {
      await sendTenantWelcomeEmail(
        args.email,
        args.name,
        property.name || "Your Property",
        unit.unitNumber || "Unit",
        args.leaseStart,
        company?.name
      );
    } catch (error) {
      console.error("Failed to send tenant welcome email:", error);
    }

    // In-app notification for company admin
    await insertNotification(ctx.db, {
      companyId,
      type: "tenant_created",
      message: `New tenant added: ${args.name} at ${property.name}, Unit ${unit.unitNumber}`,
      tenantId,
    });

    return tenantId;
  },
});


export const getAllTenants = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, { token }) => {
    if (!token) return [];

    const companyId = await getCompanyIdFromToken(ctx, token);


    return ctx.db
      .query("tenants")
      .withIndex("by_company", q => q.eq("companyId", companyId))
      .collect();
  },
});


/* ---------------------------------
   GET TENANTS BY PROPERTY
---------------------------------- */
export const getTenantsByProperty = query({
  args: {
    token: v.string(),
    propertyId: v.id("properties"),
  },

  handler: async (ctx, { token, propertyId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);


    const property = await ctx.db.get(propertyId);
    if (!property || property.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return ctx.db
      .query("tenants")
      .withIndex("by_property", q => q.eq("propertyId", propertyId))
      .filter(q => q.eq(q.field("companyId"), companyId))
      .collect();
  },
});

/* ---------------------------------
   GET TENANT BY ID
---------------------------------- */
export const getTenantById = query({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, { token, tenantId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);


    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    return tenant;
  },
});

/* ---------------------------------
   UPDATE TENANT
---------------------------------- */
export const updateTenant = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),

//     updates: v.object({
//       name: v.optional(v.string()),
//       phone: v.optional(v.string()),
//       email: v.optional(v.string()),
//       leaseStart: v.optional(v.string()),
//       leaseEnd: v.optional(v.string()),
//       rentAmount: v.optional(v.number()),
//       rentFrequency: v.optional(
//   v.union(v.literal("monthly"))
// ),

//       deposit: v.optional(v.number()),
//       status: v.optional(
//   v.union(
//     v.literal("active"),
//     v.literal("pending"),
//     v.literal("vacated")
//   )
// ),
//     }),
updates: v.object({
  name: v.optional(v.string()),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  dob: v.optional(v.string()),
  leaseStart: v.optional(v.string()),
  leaseEnd: v.optional(v.string()),
  rentAmount: v.optional(v.number()),
  rentFrequency: v.optional(
    v.union(v.literal("monthly"))
  ),
  deposit: v.optional(v.number()),
  status: v.optional(
    v.union(
      v.literal("active"),
      v.literal("pending"),
      v.literal("vacated")
    )
  ),
}),

  },

  handler: async (ctx, { token, tenantId, updates }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(tenantId, updates);
    return true;
  },
});

/* ---------------------------------
   ADD TENANT NOTE
---------------------------------- */
export const addTenantNote = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
    message: v.string(),
  },

  handler: async (ctx, { token, tenantId, message }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(tenantId, {
      notes: [
        ...(tenant.notes ?? []),
        {
          message,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    return true;
  },
});

/* ---------------------------------
   ADD TENANT DOCUMENT
---------------------------------- */
export const addTenantDocument = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
    type: v.string(),
    url: v.string(),
  },

  handler: async (ctx, { token, tenantId, type, url }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);


    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(tenantId, {
      documents: [
        ...(tenant.documents ?? []),
        {
          type,
          url,
          uploadedAt: new Date().toISOString(),
        },
      ],
    });

    return true;
  },
});

/* ---------------------------------
   MOVE OUT TENANT
---------------------------------- */
export const moveOutTenant = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
    unitId: v.id("units"),
  },

  handler: async (ctx, { token, tenantId, unitId }) => {
    const companyId = await getCompanyIdFromToken(ctx,token);

    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    const unit = await ctx.db.get(unitId);
    if (!unit || unit.companyId !== companyId) {
      throw new Error("Access denied");
    }

    const moveOutDate = new Date().toISOString().split("T")[0];

    await ctx.db.patch(tenantId, {
      status: "vacated",
      leaseEnd: moveOutDate,
    });

    await ctx.db.patch(unitId, {
      currentTenantId: undefined,
      status: "vacant",
    });

    const [property, unitRecord, company] = await Promise.all([
      ctx.db.get(tenant.propertyId),
      ctx.db.get(unitId),
      ctx.db.get(tenant.companyId),
    ]);
    try {
      await sendTenantMovedOutEmail(
        tenant.email,
        tenant.name,
        property?.name ?? "Property",
        unitRecord?.unitNumber ?? "Unit",
        moveOutDate,
        company?.name
      );
    } catch (error) {
      console.error("Failed to send move-out email:", error);
    }

    // In-app notification for company admin
    await insertNotification(ctx.db, {
      companyId: tenant.companyId,
      type: "tenant_moved_out",
      message: `${tenant.name} has moved out of ${property?.name ?? "Property"}, Unit ${unitRecord?.unitNumber ?? ""}`,
      tenantId,
    });

    return true;
  },
});

/* ---------------------------------
   DELETE TENANT
---------------------------------- */
export const deleteTenant = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, { token, tenantId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);


    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(tenantId);
    return true;
  },
});

export const getTenantApplicationProfile = query({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, { token, tenantId }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied");
    }

    const profile = await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) =>
        q.eq("tenantId", tenantId)
      )
      .first();

    return profile ?? null;
  },
});