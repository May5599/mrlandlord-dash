import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import {
  sendPasswordResetEmail,
  sendAdminAccountCreatedEmail,
  sendMaintenanceAssignedEmail,
  sendMaintenanceCompletedEmail,
  sendMaintenanceStatusUpdatedEmail,
  sendMaintenanceSubmittedEmail,
} from "./_lib/emailService";

export const sendPasswordReset = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    resetLink: v.string(),
    companyName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await sendPasswordResetEmail(args.email, args.name || args.email, args.resetLink);
  },
});

export const sendAdminAccountCreated = internalAction({
  args: {
    adminName: v.string(),
    adminEmail: v.string(),
    companyName: v.string(),
    password: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendAdminAccountCreatedEmail(
      args.adminName,
      args.adminEmail,
      args.companyName,
      args.password
    );
  },
});

export const sendMaintenanceSubmitted = internalAction({
  args: {
    adminEmail: v.string(),
    tenantName: v.string(),
    propertyName: v.string(),
    unitNumber: v.string(),
    maintenanceTitle: v.string(),
    category: v.string(),
    severity: v.string(),
    companyName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await sendMaintenanceSubmittedEmail(
      args.adminEmail,
      args.tenantName,
      args.propertyName,
      args.unitNumber,
      args.maintenanceTitle,
      args.category,
      args.severity,
      args.companyName
    );
  },
});

export const sendMaintenanceAssigned = internalAction({
  args: {
    vendorEmail: v.string(),
    vendorName: v.string(),
    propertyName: v.string(),
    unitNumber: v.string(),
    maintenanceTitle: v.string(),
    priority: v.string(),
    scheduledDate: v.string(),
    scheduledTime: v.string(),
    accessInstructions: v.optional(v.string()),
    companyName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await sendMaintenanceAssignedEmail(
      args.vendorEmail,
      args.vendorName,
      args.propertyName,
      args.unitNumber,
      args.maintenanceTitle,
      args.priority,
      args.scheduledDate,
      args.scheduledTime,
      args.accessInstructions,
      args.companyName
    );
  },
});

export const sendMaintenanceCompleted = internalAction({
  args: {
    vendorEmail: v.string(),
    vendorName: v.string(),
    propertyName: v.string(),
    unitNumber: v.string(),
    maintenanceTitle: v.string(),
    companyName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await sendMaintenanceCompletedEmail(
      args.vendorEmail,
      args.vendorName,
      args.propertyName,
      args.unitNumber,
      args.maintenanceTitle,
      args.companyName
    );
  },
});

export const sendMaintenanceStatusUpdated = internalAction({
  args: {
    tenantEmail: v.string(),
    tenantName: v.string(),
    maintenanceTitle: v.string(),
    newStatus: v.string(),
    propertyName: v.string(),
    unitNumber: v.string(),
    companyName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await sendMaintenanceStatusUpdatedEmail(
      args.tenantEmail,
      args.tenantName,
      args.maintenanceTitle,
      args.newStatus,
      args.propertyName,
      args.unitNumber,
      args.companyName
    );
  },
});
