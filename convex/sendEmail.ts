import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

export const sendEmail = mutation({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },

  handler: async (ctx, { to, subject, html }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "MrLandlord <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    return { success: true };
  },
});

