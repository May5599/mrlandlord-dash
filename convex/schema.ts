import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({

superAdmins: defineTable({
  name: v.string(),
  email: v.string(),
  passwordHash: v.string(),
  role: v.union(
    v.literal("super_admin"),
    v.literal("admin")
  ),
  isActive: v.boolean(),

  resetToken: v.optional(v.string()),
  resetTokenExpiresAt: v.optional(v.number()),

  createdAt: v.string(),
  mustChangePassword: v.optional(v.boolean()),

})
.index("by_email", ["email"]),




superAdminSessions: defineTable({
  adminId: v.id("superAdmins"),
  token: v.string(),
  expiresAt: v.number(),
})
  .index("by_token", ["token"]),


  // -----------------------------------------------------------
// Company Admins (Auth owners of a company)
// -----------------------------------------------------------
companyAdmins: defineTable({
  companyId: v.id("companies"),
  email: v.string(),
  passwordHash: v.string(),
  mustChangePassword: v.optional(v.boolean()),
  createdAt: v.string(),
})

  .index("by_company", ["companyId"])
  .index("by_email", ["email"]),

  // -----------------------------------------------------------
// Company Admin Sessions
// -----------------------------------------------------------
companyAdminSessions: defineTable({
  adminId: v.id("companyAdmins"),
  companyId: v.id("companies"),
  token: v.string(),
  expiresAt: v.number(),
})
  .index("by_token", ["token"])
  .index("by_company", ["companyId"]),


  

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
    rentFrequency: v.union(
  v.literal("monthly")
),


    deposit: v.number(),

    status: v.union(
  v.literal("active"),
  v.literal("pending"),
  v.literal("vacated")
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

    scheduledDate: v.optional(v.string()),      // YYYY-MM-DD
    scheduledTimeFrom: v.optional(v.string()),  // HH:mm
    scheduledTimeTo: v.optional(v.string()),    

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
    .index("by_tenant", ["tenantId"])

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


tenantProfiles: defineTable({
  companyId: v.id("companies"),
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

  currentAddress: v.optional(
    v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      province: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })
  ),

  previousAddress: v.optional(
    v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      province: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })
  ),

  occupants: v.optional(
  v.array(
    v.object({
      fullName: v.string(),
      phone: v.optional(v.string()),
      relationship: v.optional(v.string()),
    })
  )
),


  employmentStatus: v.optional(v.string()),
  employerName: v.optional(v.string()),
  employerPhone: v.optional(v.string()),
  employerEmail: v.optional(v.string()),
  jobTitle: v.optional(v.string()),
  employmentDuration: v.optional(v.string()),
  monthlyIncome: v.optional(v.number()),

  vehicle: v.optional(
    v.object({
      make: v.optional(v.string()),
      model: v.optional(v.string()),
      plate: v.optional(v.string()),
      color: v.optional(v.string()),
    })
  ),

  pets: v.optional(
    v.array(
      v.object({
        name: v.optional(v.string()),
        type: v.string(),
        breed: v.optional(v.string()),
        size: v.optional(v.string()),
        weight: v.optional(v.number()),
      })
    )
  ),

  documents: v.optional(
    v.array(
      v.object({
        type: v.union(
          v.literal("photo_id"),
          v.literal("pay_stub"),
          v.literal("credit_report")
        ),
        storageId: v.string(),
        uploadedAt: v.number(),
      })
    )
  ),

  accuracyConfirmed: v.optional(v.boolean()),
  creditCheckConsent: v.optional(v.boolean()),
  applicationCompleted: v.optional(v.boolean()),

  notes: v.optional(v.string()),

  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
})
.index("by_company", ["companyId"])
.index("by_tenant", ["tenantId"]),

leads: defineTable({
  name: v.string(),
  email: v.string(),
  portfolioSize: v.string(),
  message: v.string(),
  createdAt: v.number(),
}),

});





  export default schema;