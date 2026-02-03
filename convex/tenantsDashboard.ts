

// import { query } from "./_generated/server";
// import { v } from "convex/values";

// async function getCompanyId(ctx: any) {
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity) {
//     throw new Error("Unauthorized");
//   }

//   return identity.subject;
// }


// export const getTenantDashboard = query({
//   args: { tenantId: v.id("tenants") },

//   handler: async (ctx, { tenantId }) => {
//     const companyId = await getCompanyId(ctx);

//     const tenant = await ctx.db.get(tenantId);
//     if (!tenant || tenant.companyId !== companyId) return null;

//     const property = await ctx.db.get(tenant.propertyId);
//     if (!property || property.companyId !== companyId) return null;

//     const unit = await ctx.db.get(tenant.unitId);
//     if (!unit || unit.companyId !== companyId) return null;

//     const profile = await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
//       .filter((q) => q.eq(q.field("companyId"), companyId))
//       .first();

//     const profileComplete = Boolean(
//       profile &&
//         profile.firstName &&
//         profile.lastName &&
//         profile.dob &&
//         profile.phone &&
//         profile.emergencyContact?.name &&
//         profile.emergencyContact?.phone &&
//         profile.emergencyContact?.relationship
//     );

//     return {
//       name: tenant.name,
//       rentAmount: tenant.rentAmount,
//       rentFrequency: tenant.rentFrequency,
//       leaseStart: tenant.leaseStart,
//       leaseEnd: tenant.leaseEnd || null,
//       phone: tenant.phone,
//       email: tenant.email,

//       unitNumber: unit.unitNumber,
//       propertyAddress: property.address,

//       profileComplete,
//     };
//   },
// });
import { query } from "./_generated/server";
import { v } from "convex/values";
import { getTenantFromToken } from "./_lib/getTenantFromToken";

export const getTenantDashboard = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, { token }) => {
    const { tenant, companyId } = await getTenantFromToken(ctx, token);

    const property = await ctx.db.get(tenant.propertyId);
    if (!property || property.companyId !== companyId) return null;

    const unit = await ctx.db.get(tenant.unitId);
    if (!unit || unit.companyId !== companyId) return null;

    const profile = await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .first();

    const profileComplete = Boolean(
      profile &&
        profile.firstName &&
        profile.lastName &&
        profile.dob &&
        profile.phone &&
        profile.emergencyContact?.name &&
        profile.emergencyContact?.phone &&
        profile.emergencyContact?.relationship
    );

    return {
      name: tenant.name,
      rentAmount: tenant.rentAmount,
      rentFrequency: tenant.rentFrequency,
      leaseStart: tenant.leaseStart,
      leaseEnd: tenant.leaseEnd || null,
      phone: tenant.phone,
      email: tenant.email,

      unitNumber: unit.unitNumber,
      propertyAddress: property.address,

      profileComplete,
    };
  },
});
