import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({


superAdmins: defineTable({
  email: v.string(),
  passwordHash: v.string(),
  createdAt: v.string(),
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

contacts: defineTable({
  companyId: v.id("companies"),

  type: v.string(),   // tenant | vendor | contractor | emergency
  name: v.string(),
  phone: v.string(),
  email: v.string(),

  propertyId: v.optional(v.id("properties")),
  unitId: v.optional(v.id("units")),

  notes: v.optional(v.string()),
  createdAt: v.number(), // you used Date.now() → number
})
  .index("by_company", ["companyId"])
  .index("by_type", ["type"]),



});

export default schema;

