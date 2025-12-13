// import { query } from "./_generated/server";

// import { v } from "convex/values";

// export const getTenantDashboard = query({
//   args: { tenantId: v.id("tenants") },

//   handler: async (ctx, args) => {
//     const { tenantId } = args;

//     const tenant = await ctx.db.get(tenantId);
//     if (!tenant) return null;

//     // Fetch property + unit
//     const property = await ctx.db.get(tenant.propertyId);
//     const unit = await ctx.db.get(tenant.unitId);

//     const profile = await ctx.db
//   .query("tenantProfiles")
//   .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
//   .first();

// // Determine profile completeness
// const profileComplete = Boolean(
//   profile &&
//   profile.firstName &&
//   profile.lastName &&
//   profile.dob &&
//   profile.phone &&
//   profile.emergencyContact?.name &&
//   profile.emergencyContact?.phone &&
//   profile.emergencyContact?.relationship
// );


//     return {
//       name: tenant.name,
//       rentAmount: tenant.rentAmount,
//       rentFrequency: tenant.rentFrequency,
//       leaseStart: tenant.leaseStart,
//       leaseEnd: tenant.leaseEnd || null,
//       phone: tenant.phone,
//       email: tenant.email,
//       unitNumber: unit?.unitNumber || "N/A",
//       propertyAddress: property?.address || "N/A",
//       profileComplete,
//     };
//   },
// });


// import { query } from "./_generated/server";
// import { v } from "convex/values";

// export const getTenantDashboard = query({
//   args: { tenantId: v.id("tenants") },

//   handler: async (ctx, { tenantId }) => {
//     // Identify company from logged-in identity
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const companyId = identity.subject;

//     // Fetch tenant and ensure company is correct
//     const tenant = await ctx.db.get(tenantId);
//     if (!tenant || tenant.companyId !== companyId) {
//       return null; // block access
//     }

//     // Fetch property belonging to the same company
//     const property = await ctx.db.get(tenant.propertyId);
//     if (property?.companyId !== companyId) return null;

//     // Fetch unit belonging to the same company
//     const unit = await ctx.db.get(tenant.unitId);
//     if (unit?.companyId !== companyId) return null;

//     // Fetch tenant profile
//     const profile = await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
//       .filter((q) => q.eq(q.field("companyId"), companyId))
//       .first();

//     // Profile completeness check
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

//       unitNumber: unit?.unitNumber || "N/A",
//       propertyAddress: property?.address || "N/A",

//       profileComplete,
//     };
//   },
// });



import { query } from "./_generated/server";
import { v } from "convex/values";

// DEV MODE COMPANY ID
async function getCompanyId(ctx: any) {
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}

export const getTenantDashboard = query({
  args: { tenantId: v.id("tenants") },

  handler: async (ctx, { tenantId }) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) return null;

    const property = await ctx.db.get(tenant.propertyId);
    if (!property || property.companyId !== companyId) return null;

    const unit = await ctx.db.get(tenant.unitId);
    if (!unit || unit.companyId !== companyId) return null;

    const profile = await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
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
