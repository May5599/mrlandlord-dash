


// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";
// import { getTenantFromToken } from "./_lib/getTenantFromToken";

// /* -----------------------------------------------------
//     1. CREATE PROFILE
// ----------------------------------------------------- */
// export const createProfile = mutation({
//   args: {
//     token: v.string(),
//     tenantId: v.id("tenants"),

//     firstName: v.optional(v.string()),
//     middleName: v.optional(v.string()),
//     lastName: v.optional(v.string()),
//     dob: v.optional(v.string()),
//     phone: v.optional(v.string()),

//     employmentStatus: v.optional(v.string()),
//     employerName: v.optional(v.string()),
//     jobTitle: v.optional(v.string()),
//     monthlyIncome: v.optional(v.number()),

//     occupants: v.optional(
//       v.array(
//         v.object({
//           fullName: v.string(),
//           phone: v.optional(v.string()),
//           relationship: v.optional(v.string()),
//         })
//       )
//     ),

//     vehicle: v.optional(
//       v.object({
//         model: v.optional(v.string()),
//         plate: v.optional(v.string()),
//       })
//     ),

//     pets: v.optional(
//       v.array(
//         v.object({
//           type: v.string(),
//           size: v.string(),
//         })
//       )
//     ),

//     emergencyContact: v.optional(
//       v.object({
//         name: v.optional(v.string()),
//         phone: v.optional(v.string()),
//         relationship: v.optional(v.string()),
//       })
//     ),

//     notes: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const { tenant, companyId } = await getTenantFromToken(ctx, args.token);
//     const { token, tenantId, ...profileData } = args;

//     if (tenant._id !== tenantId) {
//  {
//       throw new Error("Access denied");
//     }

//     const existing = await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
//       .first();

//     if (existing) throw new Error("Profile already exists");

   

// const id = await ctx.db.insert("tenantProfiles", {
//   tenantId,
//   ...profileData,
//   companyId,
//   createdAt: Date.now(),
// });



//     await ctx.db.patch(args.tenantId, {
//       onboardingStatus: "active",
//     });

//     return { success: true, profileId: id };
//   },
// });

// /* -----------------------------------------------------
//     2. UPDATE PROFILE
// ----------------------------------------------------- */
// export const updateProfile = mutation({
//   args: {
//     token: v.string(),
//     profileId: v.id("tenantProfiles"),
//     data: v.object({
//       firstName: v.optional(v.string()),
//       middleName: v.optional(v.string()),
//       lastName: v.optional(v.string()),
//       dob: v.optional(v.string()),
//       phone: v.optional(v.string()),

//       employmentStatus: v.optional(v.string()),
//       employerName: v.optional(v.string()),
//       jobTitle: v.optional(v.string()),
//       monthlyIncome: v.optional(v.number()),

//       occupants: v.optional(
//         v.array(
//           v.object({
//             fullName: v.string(),
//             phone: v.optional(v.string()),
//             relationship: v.optional(v.string()),
//           })
//         )
//       ),

//       vehicle: v.optional(
//         v.object({
//           model: v.optional(v.string()),
//           plate: v.optional(v.string()),
//         })
//       ),

//       pets: v.optional(
//         v.array(
//           v.object({
//             type: v.string(),
//             size: v.string(),
//           })
//         )
//       ),

//       emergencyContact: v.optional(
//         v.object({
//           name: v.optional(v.string()),
//           phone: v.optional(v.string()),
//           relationship: v.optional(v.string()),
//         })
//       ),

//       notes: v.optional(v.string()),
//     }),
//   },

//   handler: async (ctx, { token, profileId, data }) => {
//     const { tenant, companyId } = await getTenantFromToken(ctx, token);

//     const profile = await ctx.db.get(profileId);
//     if (!profile || profile.companyId !== companyId) {
//       throw new Error("Access denied");
//     }

//     await ctx.db.patch(profileId, data);
//     return { success: true };
//   },
// });

// /* -----------------------------------------------------
//     3. GET PROFILE
// ----------------------------------------------------- */
// export const getProfile = query({
//   args: {
//     token: v.string(),
//     tenantId: v.id("tenants"),
//   },

//   handler: async (ctx, { token, tenantId }) => {
//     const { tenant, companyId } = await getTenantFromToken(ctx, token);

//     if (tenant._id !== tenantId) {
//       throw new Error("Access denied");
//     }

//     return ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
//       .first();
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getTenantFromToken } from "./_lib/getTenantFromToken";

/* -----------------------------------------------------
    1. CREATE PROFILE
----------------------------------------------------- */
export const createProfile = mutation({
  args: {
    token: v.string(),
    tenantId: v.id("tenants"),

    firstName: v.optional(v.string()),
    middleName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dob: v.optional(v.string()),
    phone: v.optional(v.string()),

    employmentStatus: v.optional(v.string()),
    employerName: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    monthlyIncome: v.optional(v.number()),

    occupants: v.optional(
      v.array(
        v.object({
          fullName: v.string(),
          phone: v.optional(v.string()),
          relationship: v.optional(v.string()),
        })
      )
    ),

    vehicle: v.optional(
      v.object({
        model: v.optional(v.string()),
        plate: v.optional(v.string()),
      })
    ),

    pets: v.optional(
      v.array(
        v.object({
          type: v.string(),
          size: v.string(),
        })
      )
    ),

    emergencyContact: v.optional(
      v.object({
        name: v.optional(v.string()),
        phone: v.optional(v.string()),
        relationship: v.optional(v.string()),
      })
    ),

    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const { tenant, companyId } = await getTenantFromToken(ctx, args.token);
    const { tenantId, token, ...profileData } = args;

    if (tenant._id !== tenantId) {
      throw new Error("Access denied");
    }

    const existing = await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();

    if (existing) throw new Error("Profile already exists");

    const id = await ctx.db.insert("tenantProfiles", {
      tenantId,
      ...profileData,
      companyId,
      createdAt: Date.now(),
    });

    await ctx.db.patch(tenantId, {
      onboardingStatus: "active",
    });

    return { success: true, profileId: id };
  },
});

/* -----------------------------------------------------
    2. UPDATE PROFILE
----------------------------------------------------- */
export const updateProfile = mutation({
  args: {
    token: v.string(),
    profileId: v.id("tenantProfiles"),
    data: v.object({
      firstName: v.optional(v.string()),
      middleName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      dob: v.optional(v.string()),
      phone: v.optional(v.string()),

      employmentStatus: v.optional(v.string()),
      employerName: v.optional(v.string()),
      jobTitle: v.optional(v.string()),
      monthlyIncome: v.optional(v.number()),

      occupants: v.optional(
        v.array(
          v.object({
            fullName: v.string(),
            phone: v.optional(v.string()),
            relationship: v.optional(v.string()),
          })
        )
      ),

      vehicle: v.optional(
        v.object({
          model: v.optional(v.string()),
          plate: v.optional(v.string()),
        })
      ),

      pets: v.optional(
        v.array(
          v.object({
            type: v.string(),
            size: v.string(),
          })
        )
      ),

      emergencyContact: v.optional(
        v.object({
          name: v.optional(v.string()),
          phone: v.optional(v.string()),
          relationship: v.optional(v.string()),
        })
      ),

      notes: v.optional(v.string()),
    }),
  },

  handler: async (ctx, { token, profileId, data }) => {
    const { tenant, companyId } = await getTenantFromToken(ctx, token);

    const profile = await ctx.db.get(profileId);
    if (!profile || profile.companyId !== companyId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(profileId, data);
    return { success: true };
  },
});

/* -----------------------------------------------------
    3. GET PROFILE
----------------------------------------------------- */
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

    return ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();
  },
});
