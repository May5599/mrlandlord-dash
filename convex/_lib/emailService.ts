/**
 * convex/_lib/emailService.ts
 * 
 * Centralized Email Service with Type Safety
 * All email sending goes through this service
 * Ensures consistent sender, proper error handling, and type safety
 */

import { Resend } from "resend";

// ===============================================
// TYPE DEFINITIONS
// ===============================================

interface AdminAccountCreatedData {
  adminName: string;
  adminEmail: string;
  companyName: string;
  password: string;
}

interface PasswordResetData {
  email: string;
  name: string;
  resetLink: string;
}

interface TenantWelcomeData {
  email: string;
  name: string;
  property: string;
  unit: string;
  leaseStart: string;
}

interface MaintenanceAssignedData {
  vendorEmail: string;
  vendorName: string;
  maintenanceTitle: string;
  property: string;
  scheduledDate: string;
  scheduledTimeFrom: string;
  scheduledTimeTo: string;
}

interface MaintenanceCompletedData {
  vendorEmail: string;
  vendorName: string;
  maintenanceTitle: string;
  cost?: string;
}

interface PropertyCreatedData {
  ownerEmail: string;
  ownerName: string;
  propertyName: string;
  address: string;
  city: string;
}

interface ContactFormData {
  senderName: string;
  senderEmail: string;
  portfolioSize: string;
  message: string;
}

interface RentDueData {
  tenantEmail: string;
  tenantName: string;
  property: string;
  unit: string;
  rentAmount: number;
  dueDate: string;
}

interface RentOverdueData {
  tenantEmail: string;
  tenantName: string;
  property: string;
  unit: string;
  rentAmount: number;
  daysOverdue: number;
  dueDate: string;
}

interface MaintenanceSubmittedData {
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  maintenanceTitle: string;
  category: string;
  severity: string;
}

interface MaintenanceStatusUpdatedData {
  tenantName: string;
  maintenanceTitle: string;
  newStatus: string;
  propertyName: string;
  unitNumber: string;
}

interface VendorWelcomeData {
  vendorName: string;
  specialty?: string;
}

interface TenantMovedOutData {
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  moveOutDate: string;
}

type EmailDataMap = {
  admin_account_created: AdminAccountCreatedData;
  password_reset: PasswordResetData;
  tenant_welcome: TenantWelcomeData;
  maintenance_assigned: MaintenanceAssignedData;
  maintenance_completed: MaintenanceCompletedData;
  property_created: PropertyCreatedData;
  contact_form: ContactFormData;
  rent_due: RentDueData;
  rent_overdue: RentOverdueData;
  maintenance_submitted: MaintenanceSubmittedData;
  maintenance_status_updated: MaintenanceStatusUpdatedData;
  vendor_welcome: VendorWelcomeData;
  tenant_moved_out: TenantMovedOutData;
};

interface EmailSendResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

// ===============================================
// RESEND CLIENT
// ===============================================

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// ===============================================
// CONFIGURATION
// ===============================================

const EMAIL_FROM = process.env.EMAIL_FROM_ADDRESS || "onboarding@resend.dev";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Mr. Landlord";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ===============================================
// EMAIL TYPES & TEMPLATES
// ===============================================

export enum EmailType {
  ADMIN_ACCOUNT_CREATED = "admin_account_created",
  PASSWORD_RESET = "password_reset",
  TENANT_WELCOME = "tenant_welcome",
  MAINTENANCE_ASSIGNED = "maintenance_assigned",
  MAINTENANCE_COMPLETED = "maintenance_completed",
  PROPERTY_CREATED = "property_created",
  CONTACT_FORM = "contact_form",
  RENT_DUE = "rent_due",
  RENT_OVERDUE = "rent_overdue",
  MAINTENANCE_SUBMITTED = "maintenance_submitted",
  MAINTENANCE_STATUS_UPDATED = "maintenance_status_updated",
  VENDOR_WELCOME = "vendor_welcome",
  TENANT_MOVED_OUT = "tenant_moved_out",
}

// ===============================================
// EMAIL TEMPLATES
// ===============================================

const emailTemplates = {
  [EmailType.ADMIN_ACCOUNT_CREATED]: {
    subject: "Your Mr. Landlord Admin Account Created",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: #667eea; text-decoration: none; }
          strong { color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Mr. Landlord!</h1>
          </div>
          <div class="content">
            <h2>Your Admin Account Has Been Created</h2>
            <p>Hi ${data.adminName},</p>
            <p>Your admin account for <strong>${data.companyName}</strong> has been successfully created.</p>
            
            <div class="details-box">
              <p><strong>📧 Email:</strong> ${data.adminEmail}</p>
              <p><strong>🔐 Password:</strong> ${data.password}</p>
              <p><strong>🏢 Company:</strong> ${data.companyName}</p>
            </div>
            
            <p><strong>⚠️ Important:</strong> Please change your password immediately after logging in.</p>
            
            <p>
              <a href="${APP_URL}/admin/login" style="background-color: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Login to Dashboard
              </a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't expect this email, please contact support at ${process.env.EMAIL_SUPPORT || "support@mrlandlord.ca"}
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.PASSWORD_RESET]: {
    subject: "Reset Your Mr. Landlord Password",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${data.recipientName || 'User'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password.</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${data.resetLink}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </p>
            
            <div class="alert">
              <strong>⏰ This link expires in 30 minutes</strong>
            </div>
            
            <p>If you didn't request this, you can safely ignore this email.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              For security, we never send passwords via email.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.TENANT_WELCOME]: {
    subject: "Welcome to Your New Home - Tenant Portal",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome ${data.tenantName}!</h1>
          </div>
          <div class="content">
            <p>We're excited to have you as a tenant at ${data.propertyName}.</p>
            
            <div class="details-box">
              <p><strong>📍 Property:</strong> ${data.propertyName}</p>
              <p><strong>🏢 Unit:</strong> ${data.unitNumber}</p>
              <p><strong>📅 Lease Start:</strong> ${data.leaseStart}</p>
            </div>
            
            <h3>Your Tenant Portal</h3>
            <p>You can now access your tenant portal to:</p>
            <ul>
              <li>View and pay rent</li>
              <li>Submit maintenance requests</li>
              <li>Access lease documents</li>
              <li>Communicate with management</li>
            </ul>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/tenant/login" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Access Portal
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.MAINTENANCE_ASSIGNED]: {
    subject: "New Maintenance Request Assigned",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Maintenance Request Assigned</h1>
          </div>
          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>A new maintenance request has been assigned to you.</p>
            
            <div class="details-box">
              <p><strong>📍 Property:</strong> ${data.propertyName}</p>
              <p><strong>🏢 Unit:</strong> ${data.unitNumber}</p>
              <p><strong>🔧 Issue:</strong> ${data.maintenanceTitle}</p>
              <p><strong>⚠️ Priority:</strong> ${data.priority}</p>
              <p><strong>📅 Scheduled:</strong> ${data.scheduledDate} at ${data.scheduledTime}</p>
            </div>
            
            <p><strong>Access Instructions:</strong></p>
            <p>${data.accessInstructions || 'Standard key access'}</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/vendor/dashboard" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Details
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.MAINTENANCE_COMPLETED]: {
    subject: "Maintenance Request Completed",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Maintenance Completed</h1>
          </div>
          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>The maintenance request has been completed.</p>
            
            <div class="details-box">
              <p><strong>📍 Property:</strong> ${data.propertyName}</p>
              <p><strong>🏢 Unit:</strong> ${data.unitNumber}</p>
              <p><strong>🔧 Issue:</strong> ${data.maintenanceTitle}</p>
              <p><strong>✅ Status:</strong> Completed</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.PROPERTY_CREATED]: {
    subject: "New Property Created in Your Account",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Property Added</h1>
          </div>
          <div class="content">
            <p>Hi ${data.managerName || 'Admin'},</p>
            <p>A new property has been added to your account.</p>
            
            <div class="details-box">
              <p><strong>🏠 Property:</strong> ${data.propertyName}</p>
              <p><strong>📍 Address:</strong> ${data.address}</p>
              <p><strong>🏘️ City:</strong> ${data.city}</p>
              <p><strong>📮 Postal Code:</strong> ${data.postalCode}</p>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/dashboard/properties" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Property
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.CONTACT_FORM]: {
    subject: "New Contact Form Submission",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Submission</h1>
          </div>
          <div class="content">
            <div class="details-box">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Portfolio Size:</strong> ${data.portfolioSize}</p>
            </div>
            
            <h3>Message:</h3>
            <p>${data.message}</p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.RENT_DUE]: {
    subject: "Rent Payment Due - ${data.propertyName}",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Rent Payment Due</h1>
          </div>
          <div class="content">
            <p>Hi ${data.tenantName},</p>
            <p>Your rent payment is due soon.</p>
            
            <div class="details-box">
              <p><strong>💰 Amount Due:</strong> $${data.rentAmount}</p>
              <p><strong>📅 Due Date:</strong> ${data.dueDate}</p>
              <p><strong>📍 Property:</strong> ${data.propertyName}, ${data.unitNumber}</p>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/tenant/dashboard" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Pay Rent
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.MAINTENANCE_SUBMITTED]: {
    subject: "New Maintenance Request Submitted",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>New Maintenance Request</h1></div>
          <div class="content">
            <p>A tenant has submitted a new maintenance request.</p>
            <div class="details-box">
              <p><strong>👤 Tenant:</strong> ${data.tenantName}</p>
              <p><strong>🏠 Property:</strong> ${data.propertyName}</p>
              <p><strong>🚪 Unit:</strong> ${data.unitNumber}</p>
              <p><strong>🔧 Issue:</strong> ${data.maintenanceTitle}</p>
              <p><strong>📂 Category:</strong> ${data.category}</p>
              <p><strong>⚠️ Severity:</strong> ${data.severity}</p>
            </div>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/dashboard/maintenance" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Request
              </a>
            </p>
          </div>
          <div class="footer"><p>© 2024 Mr. Landlord. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.MAINTENANCE_STATUS_UPDATED]: {
    subject: "Your Maintenance Request Has Been Updated",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Maintenance Update</h1></div>
          <div class="content">
            <p>Hi ${data.tenantName},</p>
            <p>Your maintenance request has been updated.</p>
            <div class="details-box">
              <p><strong>🔧 Issue:</strong> ${data.maintenanceTitle}</p>
              <p><strong>🏠 Property:</strong> ${data.propertyName}, Unit ${data.unitNumber}</p>
              <p><strong>📋 New Status:</strong> <strong style="text-transform: capitalize;">${data.newStatus}</strong></p>
            </div>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/tenant/maintenance" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Details
              </a>
            </p>
          </div>
          <div class="footer"><p>© 2024 Mr. Landlord. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.VENDOR_WELCOME]: {
    subject: "Welcome to Mr. Landlord — Vendor Registration",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Welcome, ${data.vendorName}!</h1></div>
          <div class="content">
            <p>You have been registered as a vendor with Mr. Landlord.</p>
            <div class="details-box">
              <p><strong>👤 Name:</strong> ${data.vendorName}</p>
              ${data.specialty ? `<p><strong>🔧 Specialty:</strong> ${data.specialty}</p>` : ""}
            </div>
            <p>You will receive email notifications when maintenance requests are assigned to you.</p>
          </div>
          <div class="footer"><p>© 2024 Mr. Landlord. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.TENANT_MOVED_OUT]: {
    subject: "Your Tenancy Has Ended — Move Out Confirmation",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #6b7280 0%, #374151 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .details-box { background-color: #f9fafb; border-left: 4px solid #6b7280; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Move Out Confirmed</h1></div>
          <div class="content">
            <p>Hi ${data.tenantName},</p>
            <p>Your tenancy has officially ended. Thank you for being a tenant with us.</p>
            <div class="details-box">
              <p><strong>🏠 Property:</strong> ${data.propertyName}</p>
              <p><strong>🚪 Unit:</strong> ${data.unitNumber}</p>
              <p><strong>📅 Move Out Date:</strong> ${data.moveOutDate}</p>
            </div>
            <p>If you have any questions regarding your deposit or final balance, please contact your property manager.</p>
          </div>
          <div class="footer"><p>© 2024 Mr. Landlord. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `
  },

  [EmailType.RENT_OVERDUE]: {
    subject: "⚠️ Rent Payment Overdue",
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #ff5252 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .alert { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .footer { font-size: 12px; color: #666; text-align: center; }
          a { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Rent Payment Overdue</h1>
          </div>
          <div class="content">
            <p>Hi ${data.tenantName},</p>
            <p>Your rent payment is overdue. Please pay immediately to avoid late fees and further consequences.</p>
            
            <div class="alert">
              <p><strong>💰 Amount Due:</strong> $${data.rentAmount}</p>
              <p><strong>📅 Days Overdue:</strong> ${data.daysOverdue}</p>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${APP_URL}/tenant/dashboard" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Pay Immediately
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Mr. Landlord. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
};

// ===============================================
// MAIN EMAIL FUNCTION
// ===============================================

export async function sendEmailWithResend(
  emailType: EmailType,
  recipientEmail: string,
  data: any,
  companyName?: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not configured");
      return { success: false, error: "Email service not configured" };
    }

    const template = emailTemplates[emailType];
    if (!template) {
      console.error(`❌ Email template not found: ${emailType}`);
      return { success: false, error: "Email template not found" };
    }

    const fromName = companyName ?? EMAIL_FROM_NAME;
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: `${fromName} <${EMAIL_FROM}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.getHtml(data),
    });

    if (response.error) {
      console.error(`❌ Email send failed: ${response.error.message}`);
      return { success: false, error: response.error.message };
    }

    console.log(`✅ Email sent to ${recipientEmail} (${emailType})`);
    return { success: true, messageId: response.data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Email error: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

// ===============================================
// HELPER FUNCTIONS FOR SPECIFIC EMAILS
// ===============================================

export async function sendAdminAccountCreatedEmail(
  adminName: string,
  adminEmail: string,
  companyName: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.ADMIN_ACCOUNT_CREATED, adminEmail, {
    adminName,
    adminEmail,
    companyName,
    password,
  }, companyName);
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  recipientName: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.PASSWORD_RESET, recipientEmail, {
    recipientName,
    resetLink,
  });
}

export async function sendTenantWelcomeEmail(
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  unitNumber: string,
  leaseStart: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.TENANT_WELCOME, tenantEmail, {
    tenantName,
    propertyName,
    unitNumber,
    leaseStart,
  }, companyName);
}

export async function sendMaintenanceAssignedEmail(
  recipientEmail: string,
  recipientName: string,
  propertyName: string,
  unitNumber: string,
  maintenanceTitle: string,
  priority: string,
  scheduledDate: string,
  scheduledTime: string,
  accessInstructions?: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.MAINTENANCE_ASSIGNED, recipientEmail, {
    recipientName,
    propertyName,
    unitNumber,
    maintenanceTitle,
    priority,
    scheduledDate,
    scheduledTime,
    accessInstructions,
  }, companyName);
}

export async function sendMaintenanceCompletedEmail(
  recipientEmail: string,
  recipientName: string,
  propertyName: string,
  unitNumber: string,
  maintenanceTitle: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.MAINTENANCE_COMPLETED, recipientEmail, {
    recipientName,
    propertyName,
    unitNumber,
    maintenanceTitle,
  }, companyName);
}

export async function sendPropertyCreatedEmail(
  managerEmail: string,
  managerName: string,
  propertyName: string,
  address: string,
  city: string,
  postalCode: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.PROPERTY_CREATED, managerEmail, {
    managerName,
    propertyName,
    address,
    city,
    postalCode,
  }, companyName);
}

export async function sendContactFormEmail(
  adminEmail: string,
  name: string,
  email: string,
  portfolioSize: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.CONTACT_FORM, adminEmail, {
    name,
    email,
    portfolioSize,
    message,
  });
}

export async function sendRentDueEmail(
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  unitNumber: string,
  rentAmount: number,
  dueDate: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.RENT_DUE, tenantEmail, {
    tenantName,
    propertyName,
    unitNumber,
    rentAmount,
    dueDate,
  }, companyName);
}

export async function sendRentOverdueEmail(
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  unitNumber: string,
  rentAmount: number,
  daysOverdue: number,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.RENT_OVERDUE, tenantEmail, {
    tenantName,
    propertyName,
    unitNumber,
    rentAmount,
    daysOverdue,
  }, companyName);
}

export async function sendMaintenanceSubmittedEmail(
  adminEmail: string,
  tenantName: string,
  propertyName: string,
  unitNumber: string,
  maintenanceTitle: string,
  category: string,
  severity: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.MAINTENANCE_SUBMITTED, adminEmail, {
    tenantName,
    propertyName,
    unitNumber,
    maintenanceTitle,
    category,
    severity,
  }, companyName);
}

export async function sendMaintenanceStatusUpdatedEmail(
  tenantEmail: string,
  tenantName: string,
  maintenanceTitle: string,
  newStatus: string,
  propertyName: string,
  unitNumber: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.MAINTENANCE_STATUS_UPDATED, tenantEmail, {
    tenantName,
    maintenanceTitle,
    newStatus,
    propertyName,
    unitNumber,
  }, companyName);
}

export async function sendVendorWelcomeEmail(
  vendorEmail: string,
  vendorName: string,
  specialty?: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.VENDOR_WELCOME, vendorEmail, {
    vendorName,
    specialty,
  }, companyName);
}

export async function sendTenantMovedOutEmail(
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  unitNumber: string,
  moveOutDate: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmailWithResend(EmailType.TENANT_MOVED_OUT, tenantEmail, {
    tenantName,
    propertyName,
    unitNumber,
    moveOutDate,
  }, companyName);
}

export default {
  sendEmailWithResend,
  sendAdminAccountCreatedEmail,
  sendPasswordResetEmail,
  sendTenantWelcomeEmail,
  sendMaintenanceAssignedEmail,
  sendMaintenanceCompletedEmail,
  sendPropertyCreatedEmail,
  sendContactFormEmail,
  sendRentDueEmail,
  sendRentOverdueEmail,
};
