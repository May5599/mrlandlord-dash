import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { sendPasswordResetEmail, sendAdminAccountCreatedEmail } from "./_lib/emailService";

export const sendPasswordReset = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    resetLink: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendPasswordResetEmail(args.email, args.name, args.resetLink);
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
