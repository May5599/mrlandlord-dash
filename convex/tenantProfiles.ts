
// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";
// import { Id } from "./_generated/dataModel";
// import { getTenantFromToken } from "./_lib/getTenantFromToken";

// /* =========================================================
//    SHARED PROFILE VALIDATOR
// ========================================================= */

// const addressValidator = v.object({
//   street: v.optional(v.string()),
//   city: v.optional(v.string()),
//   province: v.optional(v.string()),
//   postalCode: v.optional(v.string()),
// });

// const occupantValidator = v.object({
//   fullName: v.string(),
//   phone: v.optional(v.string()),
//   relationship: v.optional(v.string()),
// });

// const petValidator = v.object({
//   name: v.optional(v.string()),
//   type: v.string(),
//   breed: v.optional(v.string()),
//   size: v.optional(v.string()),
//   weight: v.optional(v.number()),
// });

// const documentValidator = v.object({
//   type: v.union(
//     v.literal("photo_id"),
//     v.literal("pay_stub"),
//     v.literal("credit_report")
//   ),
//   storageId: v.string(),
//   uploadedAt: v.number(),
// });

// const vehicleValidator = v.object({
//   make: v.optional(v.string()),
//   model: v.optional(v.string()),
//   plate: v.optional(v.string()),
//   color: v.optional(v.string()),
// });

// /* =========================================================
//    CREATE PROFILE
// ========================================================= */

// export const createProfile = mutation({
//   args: {
//     token: v.string(),
//     tenantId: v.id("tenants"),

//     profileImageId: v.optional(v.string()),

//     firstName: v.optional(v.string()),
//     middleName: v.optional(v.string()),
//     lastName: v.optional(v.string()),
//     dob: v.optional(v.string()),
//     phone: v.optional(v.string()),
//     weight: v.optional(v.number()),

//     idType: v.optional(v.string()),
//     idNumber: v.optional(v.string()),
//     idExpiry: v.optional(v.string()),
//     citizenshipStatus: v.optional(v.string()),

//     currentAddress: v.optional(addressValidator),
//     previousAddress: v.optional(addressValidator),

//     occupants: v.optional(v.array(occupantValidator)),

//     employmentStatus: v.optional(v.string()),
//     employerName: v.optional(v.string()),
//     employerPhone: v.optional(v.string()),
//     employerEmail: v.optional(v.string()),
//     jobTitle: v.optional(v.string()),
//     employmentDuration: v.optional(v.string()),
//     monthlyIncome: v.optional(v.number()),

//     vehicle: v.optional(vehicleValidator),
//     pets: v.optional(v.array(petValidator)),
//     documents: v.optional(v.array(documentValidator)),

//     accuracyConfirmed: v.optional(v.boolean()),
//     creditCheckConsent: v.optional(v.boolean()),
//     applicationCompleted: v.optional(v.boolean()),

//     notes: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const { tenant, companyId } = await getTenantFromToken(ctx, args.token);

//     if (tenant._id !== args.tenantId) {
//       throw new Error("Access denied");
//     }

//     const existing = await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) =>
//         q.eq("tenantId", args.tenantId)
//       )
//       .first();

//     if (existing) {
//       throw new Error("Profile already exists");
//     }

//     const { token, tenantId, ...data } = args;

//     const profileId = await ctx.db.insert("tenantProfiles", {
//       tenantId,
//       companyId,
//       ...data,
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     });

//     await ctx.db.patch(tenantId, {
//       onboardingStatus: "active",
//     });

//     return { success: true, profileId };
//   },
// });

// /* =========================================================
//    UPDATE PROFILE
// ========================================================= */

// export const updateProfile = mutation({
//   args: {
//     token: v.string(),
//     profileId: v.id("tenantProfiles"),
//     data: v.object({
//       profileImageId: v.optional(v.string()),

//       firstName: v.optional(v.string()),
//       middleName: v.optional(v.string()),
//       lastName: v.optional(v.string()),
//       dob: v.optional(v.string()),
//       phone: v.optional(v.string()),
//       weight: v.optional(v.number()),

//       idType: v.optional(v.string()),
//       idNumber: v.optional(v.string()),
//       idExpiry: v.optional(v.string()),
//       citizenshipStatus: v.optional(v.string()),

//       currentAddress: v.optional(addressValidator),
//       previousAddress: v.optional(addressValidator),

//       occupants: v.optional(v.array(occupantValidator)),

//       employmentStatus: v.optional(v.string()),
//       employerName: v.optional(v.string()),
//       employerPhone: v.optional(v.string()),
//       employerEmail: v.optional(v.string()),
//       jobTitle: v.optional(v.string()),
//       employmentDuration: v.optional(v.string()),
//       monthlyIncome: v.optional(v.number()),

//       vehicle: v.optional(vehicleValidator),
//       pets: v.optional(v.array(petValidator)),
//       documents: v.optional(v.array(documentValidator)),

//       accuracyConfirmed: v.optional(v.boolean()),
//       creditCheckConsent: v.optional(v.boolean()),
//       applicationCompleted: v.optional(v.boolean()),

//       notes: v.optional(v.string()),
//     }),
//   },

//   handler: async (ctx, { token, profileId, data }) => {
//     const { tenant, companyId } = await getTenantFromToken(ctx, token);

//     const profile = await ctx.db.get(profileId);

//     if (
//       !profile ||
//       profile.companyId !== companyId ||
//       profile.tenantId !== tenant._id
//     ) {
//       throw new Error("Access denied");
//     }

//     if (profile.applicationCompleted) {
//       throw new Error("Application already submitted");
//     }

//     await ctx.db.patch(profileId, {
//       ...data,
//       updatedAt: Date.now(),
//     });

//     return { success: true };
//   },
// });

// /* =========================================================
//    GET PROFILE
// ========================================================= */

// export const getProfile = query({
//   args: {
//     token: v.string(),
//     tenantId: v.id("tenants"),
//   },

//   handler: async (ctx, { token, tenantId }) => {
//     const { tenant } = await getTenantFromToken(ctx, token);

//     if (tenant._id !== tenantId) {
//       throw new Error("Access denied");
//     }

//     return await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) =>
//         q.eq("tenantId", tenantId)
//       )
//       .first();
//   },
// });

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getTenantFromToken } from "./_lib/getTenantFromToken";

/* =========================================================
   SHARED VALIDATORS
========================================================= */

const addressValidator = v.object({
  street: v.optional(v.string()),
  city: v.optional(v.string()),
  province: v.optional(v.string()),
  postalCode: v.optional(v.string()),
});

const occupantValidator = v.object({
  fullName: v.string(),
  phone: v.optional(v.string()),
  relationship: v.optional(v.string()),
});

const vehicleValidator = v.object({
  make: v.optional(v.string()),
  model: v.optional(v.string()),
  plate: v.optional(v.string()),
  color: v.optional(v.string()),
});

const petValidator = v.object({
  name: v.optional(v.string()),
  type: v.string(),
  breed: v.optional(v.string()),
  size: v.optional(v.string()),
  weight: v.optional(v.number()),
});

const documentValidator = v.object({
  type: v.union(
    v.literal("photo_id"),
    v.literal("pay_stub"),
    v.literal("credit_report")
  ),
  storageId: v.string(),
  uploadedAt: v.number(),
});

/* =========================================================
   HELPER: VALIDATE DOCUMENT RULES
========================================================= */

function validateDocuments(
  documents: Array<{
    type: "photo_id" | "pay_stub" | "credit_report";
  }>
) {
  const payStubs = documents.filter((d) => d.type === "pay_stub");
  const photoIds = documents.filter((d) => d.type === "photo_id");

  if (payStubs.length > 2) {
    throw new Error("Maximum 2 pay stubs allowed");
  }

  if (photoIds.length > 1) {
    throw new Error("Only one photo ID allowed");
  }
}

/* =========================================================
   CREATE PROFILE
========================================================= */

export const createProfile = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),

    profileImageId: v.optional(v.string()),

    firstName: v.optional(v.string()),
    middleName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dob: v.optional(v.string()),
    phone: v.optional(v.string()),
    weight: v.optional(v.number()),

    idType: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    idExpiry: v.optional(v.string()),
    citizenshipStatus: v.optional(v.string()),

    currentAddress: v.optional(addressValidator),
    previousAddress: v.optional(addressValidator),

    occupants: v.optional(v.array(occupantValidator)),

    employmentStatus: v.optional(v.string()),
    employerName: v.optional(v.string()),
    employerPhone: v.optional(v.string()),
    employerEmail: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    employmentDuration: v.optional(v.string()),
    monthlyIncome: v.optional(v.number()),

    vehicle: v.optional(vehicleValidator),
    pets: v.optional(v.array(petValidator)),
    documents: v.optional(v.array(documentValidator)),

    accuracyConfirmed: v.optional(v.boolean()),
    creditCheckConsent: v.optional(v.boolean()),
    applicationCompleted: v.optional(v.boolean()),

    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const { tenant, companyId } = await getTenantFromToken(ctx, args.token);

    if (tenant._id !== args.tenantId) {
      throw new Error("Access denied");
    }

    const existing = await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .first();

    if (existing) {
      throw new Error("Profile already exists");
    }

    if (args.documents) {
      validateDocuments(args.documents);
    }

    const { token, tenantId, ...data } = args;

    const profileId = await ctx.db.insert("tenantProfiles", {
      tenantId,
      companyId,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      applicationCompleted: false,
    });

    await ctx.db.patch(tenantId, {
      onboardingStatus: "active",
    });

    return { success: true, profileId };
  },
});

/* =========================================================
   UPDATE PROFILE
========================================================= */

export const updateProfile = mutation({
  args: {
    token: v.string(),
    profileId: v.id("tenantProfiles"),
    data: v.object({
      profileImageId: v.optional(v.string()),

      firstName: v.optional(v.string()),
      middleName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      dob: v.optional(v.string()),
      phone: v.optional(v.string()),
      weight: v.optional(v.number()),

      idType: v.optional(v.string()),
      idNumber: v.optional(v.string()),
      idExpiry: v.optional(v.string()),
      citizenshipStatus: v.optional(v.string()),

      currentAddress: v.optional(addressValidator),
      previousAddress: v.optional(addressValidator),

      occupants: v.optional(v.array(occupantValidator)),

      employmentStatus: v.optional(v.string()),
      employerName: v.optional(v.string()),
      employerPhone: v.optional(v.string()),
      employerEmail: v.optional(v.string()),
      jobTitle: v.optional(v.string()),
      employmentDuration: v.optional(v.string()),
      monthlyIncome: v.optional(v.number()),

      vehicle: v.optional(vehicleValidator),
      pets: v.optional(v.array(petValidator)),
      documents: v.optional(v.array(documentValidator)),

      accuracyConfirmed: v.optional(v.boolean()),
      creditCheckConsent: v.optional(v.boolean()),

      notes: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { token, profileId, data }) => {
    const { tenant, companyId } = await getTenantFromToken(ctx, token);

    const profile = await ctx.db.get(profileId);

    if (
      !profile ||
      profile.companyId !== companyId ||
      profile.tenantId !== tenant._id
    ) {
      throw new Error("Access denied");
    }

    if (profile.applicationCompleted) {
      throw new Error("Application already submitted");
    }

    if (data.documents) {
      validateDocuments(data.documents);
    }

    await ctx.db.patch(profileId, {
      ...data,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/* =========================================================
   SUBMIT APPLICATION (Locks Profile)
========================================================= */

export const submitApplication = mutation({
  args: {
    token: v.string(),
    profileId: v.id("tenantProfiles"),
  },

  handler: async (ctx, { token, profileId }) => {
    const { tenant, companyId } = await getTenantFromToken(ctx, token);

    const profile = await ctx.db.get(profileId);

    if (
      !profile ||
      profile.companyId !== companyId ||
      profile.tenantId !== tenant._id
    ) {
      throw new Error("Access denied");
    }

    if (!profile.accuracyConfirmed || !profile.creditCheckConsent) {
      throw new Error("Consent not confirmed");
    }

    if (!profile.documents || profile.documents.length === 0) {
      throw new Error("Required documents missing");
    }

    await ctx.db.patch(profileId, {
      applicationCompleted: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/* =========================================================
   GET PROFILE
========================================================= */

export const getProfile = query({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),
  },

  handler: async (ctx, { token, tenantId }) => {
    const { tenant } = await getTenantFromToken(ctx, token);

    if (tenant._id !== tenantId) {
      throw new Error("Access denied");
    }

    return await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();
  },
});
