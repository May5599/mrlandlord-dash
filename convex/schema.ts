// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// const schema = defineSchema({

//   // -----------------------------------------------------------
//   // 1. Properties
//   // -----------------------------------------------------------
//   properties: defineTable({
//     name: v.string(),
//     type: v.optional(v.string()), // condo, house, multiplex etc.
//     address: v.string(),
//     city: v.string(),
//     state: v.optional(v.string()),
//     postalCode: v.string(),
//     country: v.string(),

//     ownerName: v.optional(v.string()),
//     ownerPhone: v.optional(v.string()),
//     ownerEmail: v.optional(v.string()),

//     managerName: v.optional(v.string()),
//     managerPhone: v.optional(v.string()),
//     managerEmail: v.optional(v.string()),

//     notes: v.optional(v.string()),
//     createdAt: v.string()
//   })
//     .index("by_city", ["city"])
//     .index("by_name", ["name"]),

//   // -----------------------------------------------------------
//   // 2. Units (belonging to a property)
//   // -----------------------------------------------------------
//   units: defineTable({
//     propertyId: v.id("properties"),

//     unitNumber: v.string(),         // e.g., 101, A-3, Basement
//     type: v.string(),               // studio, 1BHK, 2BHK
//     size: v.optional(v.string()),   // 850 sq ft
//     floor: v.optional(v.number()),

//     baseRent: v.number(),
//     status: v.string(),             // vacant, occupied, maintenance

//     currentTenantId: v.optional(v.id("tenants")),
//     notes: v.optional(v.string()),
//     createdAt: v.string()
//   })
//     .index("by_property", ["propertyId"])
//     .index("by_status", ["status"])
//     .index("by_unitNumber", ["unitNumber"]),

//   // -----------------------------------------------------------
//   // 3. Tenants (assigned to a unit)
//   // -----------------------------------------------------------
//   tenants: defineTable({
//     propertyId: v.id("properties"),
//     unitId: v.id("units"),


//     name: v.string(),
//     phone: v.string(),
//     email: v.string(),

//     dob: v.optional(v.string()),
//     profileImage: v.optional(v.string()),

//     leaseStart: v.string(),
//     leaseEnd: v.optional(v.string()),

//     rentAmount: v.number(),
//     rentFrequency: v.string(),

//     deposit: v.number(),

//     status: v.string(),

//     documents: v.optional(
//       v.array(
//         v.object({
//           type: v.string(),
//           url: v.string(),
//           uploadedAt: v.string(),
//         })
//       )
//     ),

//     notes: v.optional(
//       v.array(
//         v.object({
//           message: v.string(),
//           createdAt: v.string(),
//         })
//       )
//     ),

//     createdAt: v.string(),

//     // 🔥 OTP fields
//     otp: v.optional(v.string()),
//     otpExpiresAt: v.optional(v.number()),

//     tempPasswordHash: v.optional(v.string()),
//     passwordHash: v.optional(v.string()),
//     onboardingStatus: v.optional(v.string()),
//   // pending_setup | active
//   })
//     .index("by_email", ["email"])        // ⭐ required for login
//     .index("by_property", ["propertyId"])
//     .index("by_unit", ["unitId"])
//     .index("by_status", ["status"]),


//   // -----------------------------------------------------------
//   // 4. Maintenance Requests
//   // -----------------------------------------------------------
// // maintenance: defineTable({
// //   propertyId: v.id("properties"),
// //   unitId: v.id("units"),
// //   tenantId: v.optional(v.id("tenants")),

// //   // --- Classification fields (for routing + filtering) ---
// //   category: v.string(),                  // plumbing, electrical, HVAC, etc.
// //   severity: v.string(),                  // low, medium, high, emergency
// //   location: v.string(),                  // kitchen, bathroom, etc.

// //   accessPreference: v.optional(v.string()),  // morning, evening, any
// //   allowEntry: v.optional(v.boolean()),       // true | false

// //   // --- Core maintenance fields ---
// //   title: v.string(),
// //   description: v.string(),
// //   priority: v.string(),                    // kept for compatibility
// //   status: v.string(),                       // open, in-progress, completed

// //   images: v.optional(v.array(v.string())),
// //   cost: v.optional(v.number()),

// //   // --- NEW FIELDS ---
// //   assignedVendorId: v.optional(v.id("vendors")), 
// //   assignedAt: v.optional(v.string()),            // when manager assigned vendor

// //   // Hours log: each entry = { vendorId, hours, date, note }
// //   hoursLog: v.optional(
// //     v.array(
// //       v.object({
// //         vendorId: v.id("vendors"),
// //         hours: v.number(),
// //         date: v.string(),
// //         note: v.optional(v.string()),
// //       })
// //     )
// //   ),

// //   // Notification tracking
// //   lastNotificationSent: v.optional(v.string()),

// //   createdAt: v.string(),
// //   updatedAt: v.optional(v.string()),
// // })
// //   .index("by_property", ["propertyId"])
// //   .index("by_status", ["status"])
// //   .index("by_category", ["category"])
// //   .index("by_severity", ["severity"])
// //   .index("by_vendor", ["assignedVendorId"]),

// maintenance: defineTable({
//   propertyId: v.id("properties"),
//   unitId: v.id("units"),
//   tenantId: v.optional(v.id("tenants")),

//   // --- Classification fields (routing + filtering) ---
//   category: v.string(),                  // plumbing, electrical, HVAC, etc.
//   severity: v.string(),                  // low, medium, high, emergency
//   location: v.string(),                  // kitchen, bathroom, etc.

//   accessPreference: v.optional(v.string()),  // morning, evening, any
//   allowEntry: v.optional(v.boolean()),       // true | false

//   // --- Core maintenance fields ---
//   title: v.string(),
//   description: v.string(),
//   priority: v.string(),                      // kept for compatibility
//   status: v.string(),                         // open, in-progress, completed

//   images: v.optional(v.array(v.string())),
//   cost: v.optional(v.number()),

//   // --- NEW: Vendor assignment ---
//   assignedVendorId: v.optional(v.id("vendors")),
//   assignedAt: v.optional(v.string()),

//   // --- NEW: Hours tracking ---
//   hoursLog: v.optional(
//     v.array(
//       v.object({
//         vendorId: v.id("vendors"),
//         hours: v.number(),
//         date: v.string(),               // ISO date
//         note: v.optional(v.string()),
//       })
//     )
//   ),

//   // --- NEW: Notification tracking ---
//   lastNotificationSent: v.optional(v.string()),

//   createdAt: v.string(),
//   updatedAt: v.optional(v.string()),
// })
//   .index("by_property", ["propertyId"])
//   .index("by_status", ["status"])
//   .index("by_category", ["category"])
//   .index("by_severity", ["severity"])
//   .index("by_vendor", ["assignedVendorId"]),



// vendors: defineTable({
//   name: v.string(),
//   phone: v.string(),
//   email: v.optional(v.string()),
//   specialty: v.optional(v.string()),
//   createdAt: v.string()
// }),

// tenantOtps: defineTable({
//   email: v.string(),
//   otp: v.string(),
//   createdAt: v.number(),
// }).index("by_email", ["email"]),

// tenantSessions: defineTable({
//   tenantId: v.id("tenants"),
//   token: v.string(),
//   expiresAt: v.number()
// })
// .index("by_token", ["token"]),


// tenantProfiles: defineTable({
//   tenantId: v.id("tenants"),

//   firstName: v.optional(v.string()),
//   middleName: v.optional(v.string()),
//   lastName: v.optional(v.string()),
//   dob: v.optional(v.string()),
//   phone: v.optional(v.string()),

//   employmentStatus: v.optional(v.string()),
//   employerName: v.optional(v.string()),
//   jobTitle: v.optional(v.string()),
//   monthlyIncome: v.optional(v.number()),

//   occupants: v.optional(
//     v.array(
//       v.object({
//         fullName: v.string(),
//         phone: v.optional(v.string()),
//         relationship: v.optional(v.string())
//       })
//     )
//   ),

//   vehicle: v.optional(
//     v.object({
//       model: v.optional(v.string()),
//       plate: v.optional(v.string())
//     })
//   ),

//   pets: v.optional(
//     v.array(
//       v.object({
//         type: v.string(),
//         size: v.string()
//       })
//     )
//   ),

//   emergencyContact: v.optional(
//     v.object({
//       name: v.optional(v.string()),
//       phone: v.optional(v.string()),
//       relationship: v.optional(v.string())
//     })
//   ),

//   notes: v.optional(v.string()),

//   createdAt: v.number(),
// })
// .index("by_tenant", ["tenantId"])




// });

// export default schema;


import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({

  // -----------------------------------------------------------
  // COMPANY TABLE (required for multi-company system)
  // -----------------------------------------------------------
  companies: defineTable({
    name: v.string(),
    managerName: v.string(),
    managerEmail: v.string(),
    createdAt: v.string(),
  }),

  // -----------------------------------------------------------
  // 1. Properties
  // -----------------------------------------------------------
  properties: defineTable({
    companyId: v.id("companies"),      // 🔥 NEW

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
    createdAt: v.string()
  })
    .index("by_company", ["companyId"])
    .index("by_city", ["city"])
    .index("by_name", ["name"]),

  // -----------------------------------------------------------
  // 2. Units
  // -----------------------------------------------------------
  units: defineTable({
    companyId: v.id("companies"),      // 🔥 NEW

    propertyId: v.id("properties"),

    unitNumber: v.string(),
    type: v.string(),
    size: v.optional(v.string()),
    floor: v.optional(v.number()),

    baseRent: v.number(),
    status: v.string(),

    currentTenantId: v.optional(v.id("tenants")),
    notes: v.optional(v.string()),
    createdAt: v.string()
  })
    .index("by_company", ["companyId"])
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"])
    .index("by_unitNumber", ["unitNumber"]),

  // -----------------------------------------------------------
  // 3. Tenants
  // -----------------------------------------------------------
  tenants: defineTable({
    companyId: v.id("companies"),      // 🔥 NEW

    propertyId: v.id("properties"),
    unitId: v.id("units"),

    name: v.string(),
    phone: v.string(),
    email: v.string(),

    dob: v.optional(v.string()),
    profileImage: v.optional(v.string()),

    leaseStart: v.string(),
    leaseEnd: v.optional(v.string()),

    rentAmount: v.number(),
    rentFrequency: v.string(),

    deposit: v.number(),

    status: v.string(),

    documents: v.optional(
      v.array(
        v.object({
          type: v.string(),
          url: v.string(),
          uploadedAt: v.string(),
        })
      )
    ),

    notes: v.optional(
      v.array(
        v.object({
          message: v.string(),
          createdAt: v.string(),
        })
      )
    ),

    createdAt: v.string(),

    otp: v.optional(v.string()),
    otpExpiresAt: v.optional(v.number()),

    tempPasswordHash: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    onboardingStatus: v.optional(v.string()),
  })
    .index("by_company", ["companyId"])
    .index("by_email", ["email"])
    .index("by_property", ["propertyId"])
    .index("by_unit", ["unitId"])
    .index("by_status", ["status"]),

  // -----------------------------------------------------------
  // 4. Maintenance Requests
  // -----------------------------------------------------------
  maintenance: defineTable({
    companyId: v.id("companies"),       // 🔥 NEW

    propertyId: v.id("properties"),
    unitId: v.id("units"),
    tenantId: v.optional(v.id("tenants")),

    category: v.string(),
    severity: v.string(),
    location: v.string(),

    accessPreference: v.optional(v.string()),
    allowEntry: v.optional(v.boolean()),

    title: v.string(),
    description: v.string(),
    priority: v.string(),
    status: v.string(),

    images: v.optional(v.array(v.string())),
    cost: v.optional(v.number()),

    assignedVendorId: v.optional(v.id("vendors")),
    assignedAt: v.optional(v.string()),

    hoursLog: v.optional(
      v.array(
        v.object({
          vendorId: v.id("vendors"),
          hours: v.number(),
          date: v.string(),
          note: v.optional(v.string()),
        })
      )
    ),

    lastNotificationSent: v.optional(v.string()),

    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  })
    .index("by_company", ["companyId"])
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_severity", ["severity"])
    .index("by_vendor", ["assignedVendorId"]),

  // -----------------------------------------------------------
  // 5. Vendors
  // -----------------------------------------------------------
  vendors: defineTable({
    companyId: v.id("companies"),       // 🔥 NEW

    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    specialty: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_company", ["companyId"]),

  // -----------------------------------------------------------
  // 6. Tenant OTPs
  // -----------------------------------------------------------
  tenantOtps: defineTable({
    email: v.string(),
    otp: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // -----------------------------------------------------------
  // 7. Tenant Sessions
  // -----------------------------------------------------------
  tenantSessions: defineTable({
    companyId: v.id("companies"),      // 🔥 optional but recommended

    tenantId: v.id("tenants"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_token", ["token"]),

  // -----------------------------------------------------------
  // 8. Tenant Profiles
  // -----------------------------------------------------------
  tenantProfiles: defineTable({
    companyId: v.id("companies"),      // 🔥 NEW

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
          relationship: v.optional(v.string())
        })
      )
    ),

    vehicle: v.optional(
      v.object({
        model: v.optional(v.string()),
        plate: v.optional(v.string())
      })
    ),

    pets: v.optional(
      v.array(
        v.object({
          type: v.string(),
          size: v.string()
        })
      )
    ),

    emergencyContact: v.optional(
      v.object({
        name: v.optional(v.string()),
        phone: v.optional(v.string()),
        relationship: v.optional(v.string())
      })
    ),

    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_tenant", ["tenantId"]),

    
notifications: defineTable({
  companyId: v.id("companies"),  // FIXED

  type: v.string(),              // vendor_assigned, status_updated, hours_logged
  message: v.string(),
  maintenanceId: v.id("maintenance"),

  vendorId: v.optional(v.id("vendors")),
  tenantId: v.optional(v.id("tenants")),
  status: v.optional(v.string()),
  read: v.optional(v.boolean()),
    // NEW


  createdAt: v.string(),
})
.index("by_company", ["companyId"])
.index("by_vendor", ["vendorId"])
.index("by_maintenance", ["maintenanceId"]),


});

export default schema;
