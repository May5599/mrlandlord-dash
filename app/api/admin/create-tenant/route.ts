import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      token,
      propertyId,
      unitId,
      name,
      phone,
      email,
      leaseStart,
      leaseEnd,
      rentAmount,
      rentFrequency,
      deposit,
      status,
    } = body;

    // -----------------------------------
    // 1. Generate simple tenant password
    // -----------------------------------
    const plainPassword = `Tenant-${Math.floor(1000 + Math.random() * 9000)}`;

    // -----------------------------------
    // 2. Hash password (SAFE here)
    // -----------------------------------
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // -----------------------------------
    // 3. Call Convex createTenant
    // -----------------------------------
    const result = await fetchMutation(api.tenants.createTenant, {
      token,
      propertyId,
      unitId,
      name,
      phone,
      email,
      leaseStart,
      leaseEnd,
      rentAmount,
      rentFrequency,
      deposit,
      status,
      passwordHash,
    });

    // -----------------------------------
    // 4. Email tenant their login credentials
    // -----------------------------------
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || "noreply@resend.dev";
    const fromName = process.env.EMAIL_FROM_NAME || "Mr. Landlord";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mrlandlord.ca";

    await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: email,
      subject: "Welcome to Mr. Landlord — Your Login Details",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .credentials { background-color: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .label { font-weight: bold; color: #555; }
            .value { font-family: monospace; font-size: 16px; color: #222; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Welcome, ${name}!</h2>
              <p>Your tenant account has been created on Mr. Landlord.</p>
            </div>
            <p>Here are your login credentials. Please change your password after your first login.</p>
            <div class="credentials">
              <p><span class="label">Email:</span><br/><span class="value">${email}</span></p>
              <p><span class="label">Temporary Password:</span><br/><span class="value">${plainPassword}</span></p>
            </div>
            <a href="${appUrl}/tenant/login" class="btn">Log In Now</a>
            <div class="footer">
              <p>If you did not expect this email, please contact us at ${fromAddress}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // -----------------------------------
    // 5. Return temp password to admin
    // -----------------------------------
    return NextResponse.json({
      success: true,
      tenantId: result,
      tempPassword: plainPassword,
    });
  } catch (error: any) {
    console.error("Create tenant error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create tenant",
      },
      { status: 500 }
    );
  }
}
