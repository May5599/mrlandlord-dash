import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({

  // -----------------------------------------------------------
  // 1. Properties
  // -----------------------------------------------------------
  properties: defineTable({
    name: v.string(),
    type: v.optional(v.string()), // condo, house, multiplex etc.
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
    .index("by_city", ["city"])
    .index("by_name", ["name"]),

  // -----------------------------------------------------------
  // 2. Units (belonging to a property)
  // -----------------------------------------------------------
  units: defineTable({
    propertyId: v.id("properties"),

    unitNumber: v.string(),         // e.g., 101, A-3, Basement
    type: v.string(),               // studio, 1BHK, 2BHK
    size: v.optional(v.string()),   // 850 sq ft
    floor: v.optional(v.number()),

    baseRent: v.number(),
    status: v.string(),             // vacant, occupied, maintenance

    currentTenantId: v.optional(v.id("tenants")),
    notes: v.optional(v.string()),
    createdAt: v.string()
  })
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"])
    .index("by_unitNumber", ["unitNumber"]),

  // -----------------------------------------------------------
  // 3. Tenants (assigned to a unit)
  // -----------------------------------------------------------
  tenants: defineTable({
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

    // 🔥 OTP fields
    otp: v.optional(v.string()),
    otpExpiresAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])        // ⭐ required for login
    .index("by_property", ["propertyId"])
    .index("by_unit", ["unitId"])
    .index("by_status", ["status"]),


  // -----------------------------------------------------------
  // 4. Maintenance Requests
  // -----------------------------------------------------------
  maintenance: defineTable({
    propertyId: v.id("properties"),
    unitId: v.id("units"),
    tenantId: v.optional(v.id("tenants")),

    title: v.string(),
    description: v.string(),
    priority: v.string(), // low, medium, high
    status: v.string(),   // open, in-progress, completed

    images: v.optional(v.array(v.string())), // Convex file URLs
    cost: v.optional(v.number()),

    createdAt: v.string(),
    updatedAt: v.optional(v.string())
  })
    .index("by_property", ["propertyId"])
    .index("by_status", ["status"]),

  contacts: defineTable({
    type: v.string(), // tenant | vendor | contractor | emergency
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    propertyId: v.optional(v.id("properties")),
    unitId: v.optional(v.id("units")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
})
.index("by_type", ["type"]),

vendors: defineTable({
  name: v.string(),
  phone: v.string(),
  email: v.optional(v.string()),
  specialty: v.optional(v.string()),
  createdAt: v.string()
}),

tenantOtps: defineTable({
  email: v.string(),
  otp: v.string(),
  createdAt: v.number(),
}).index("by_email", ["email"]),

tenantSessions: defineTable({
  tenantId: v.id("tenants"),
  token: v.string(),
  expiresAt: v.number()
})
.index("by_token", ["token"]),


});

export default schema;
