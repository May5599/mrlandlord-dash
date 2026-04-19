import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY!);

const getEmailTemplate = (name: string, email: string, portfolioSize: string, message: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { margin-bottom: 20px; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #555; }
        .field-value { color: #333; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${name}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${email}</div>
          </div>
          <div class="field">
            <div class="field-label">Portfolio Size:</div>
            <div class="field-value">${portfolioSize || 'Not specified'}</div>
          </div>
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value">${message}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, portfolioSize, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Save lead in Convex
    await fetchMutation(api.leads.createLead, {
      name,
      email,
      portfolioSize,
      message,
    });

    // 2️⃣ Send Email notification
    const emailFromAddress = process.env.EMAIL_FROM_ADDRESS || "noreply@resend.dev";
    const emailFromName = process.env.EMAIL_FROM_NAME || "Mr. Landlord";
    const clientNotificationEmail = process.env.CLIENT_NOTIFICATION_EMAIL || "contact@mrlandlord.com";

    await resend.emails.send({
      from: `${emailFromName} <${emailFromAddress}>`,
      to: clientNotificationEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: getEmailTemplate(name, email, portfolioSize, message),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
