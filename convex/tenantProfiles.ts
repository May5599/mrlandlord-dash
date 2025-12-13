// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // -----------------------------------------------------
// // 1. CREATE PROFILE (Tenant's first time onboarding)
// // -----------------------------------------------------
// export const createProfile = mutation({
//   args: {
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
//           relationship: v.optional(v.string())
//         })
//       )
//     ),

//     vehicle: v.optional(
//       v.object({
//         model: v.optional(v.string()),
//         plate: v.optional(v.string())
//       })
//     ),

//     pets: v.optional(
//       v.array(
//         v.object({
//           type: v.string(),
//           size: v.string()
//         })
//       )
//     ),

//     emergencyContact: v.optional(
//       v.object({
//         name: v.optional(v.string()),
//         phone: v.optional(v.string()),
//         relationship: v.optional(v.string())
//       })
//     ),

//     notes: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const now = Date.now();

//     // Prevent duplicates — one profile per tenant
//     const existing = await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
//       .first();

//     if (existing) {
//       throw new Error("Profile already exists.");
//     }

//     // Insert new profile
//     const id = await ctx.db.insert("tenantProfiles", {
//       ...args,
//       createdAt: now,
//     });

//     // Update onboarding status to active
//     await ctx.db.patch(args.tenantId, {
//       onboardingStatus: "active",
//     });

//     return { success: true, profileId: id };
//   },
// });

// // -----------------------------------------------------
// // 2. UPDATE PROFILE (Tenant edits info later)
// // -----------------------------------------------------
// export const updateProfile = mutation({
//   args: {
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
//             relationship: v.optional(v.string())
//           })
//         )
//       ),
//       vehicle: v.optional(
//         v.object({
//           model: v.optional(v.string()),
//           plate: v.optional(v.string())
//         })
//       ),
//       pets: v.optional(
//         v.array(
//           v.object({
//             type: v.string(),
//             size: v.string()
//           })
//         )
//       ),
//       emergencyContact: v.optional(
//         v.object({
//           name: v.optional(v.string()),
//           phone: v.optional(v.string()),
//           relationship: v.optional(v.string())
//         })
//       ),
//       notes: v.optional(v.string()),
//     }),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.profileId, args.data);
//     return { success: true };
//   },
// });

// // -----------------------------------------------------
// // 3. GET PROFILE (Tenant + Manager both use this)
// // -----------------------------------------------------
// export const getProfile = query({
//   args: { tenantId: v.id("tenants") },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("tenantProfiles")
//       .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
//       .first();
//   },
// });


import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* -----------------------------------------------------
    Helper: get companyId from authenticated manager
----------------------------------------------------- */
// async function getCompanyId(ctx: any) {
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity) throw new Error("Unauthorized");
//   return identity.subject; // company identifier
// }

async function getCompanyId(ctx: any) {
  // TEMPORARY DEV MODE: always use your known company
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}





/* -----------------------------------------------------
    1. CREATE PROFILE
----------------------------------------------------- */
export const createProfile = mutation({
  args: {
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
    const companyId = await getCompanyId(ctx);
    const now = Date.now();

    // Validate tenant belongs to same company
    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied. Tenant belongs to another company.");
    }

    // Prevent duplicate profiles
    const existing = await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .first();

    if (existing) throw new Error("Profile already exists");

    // Create profile
    const id = await ctx.db.insert("tenantProfiles", {
      ...args,
      companyId,     // 🔥 Important for isolation
      createdAt: now,
    });

    // Mark tenant as active
    await ctx.db.patch(args.tenantId, {
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

  handler: async (ctx, { profileId, data }) => {
    const companyId = await getCompanyId(ctx);

    const profile = await ctx.db.get(profileId);
    if (!profile || profile.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    await ctx.db.patch(profileId, data);
    return { success: true };
  },
});

/* -----------------------------------------------------
    3. GET PROFILE (Tenant + Manager)
----------------------------------------------------- */
export const getProfile = query({
  args: { tenantId: v.id("tenants") },

  handler: async (ctx, { tenantId }) => {
    const companyId = await getCompanyId(ctx);

    const tenant = await ctx.db.get(tenantId);
    if (!tenant || tenant.companyId !== companyId) {
      throw new Error("Access denied.");
    }

    return await ctx.db
      .query("tenantProfiles")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();
  },
});
