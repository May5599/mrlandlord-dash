import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY!);

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

    // 1️⃣ Save lead in Convex
    await fetchMutation(api.leads.createLead, {
      name,
      email,
      portfolioSize,
      message,
    });

    // 2️⃣ Send Email to Client
    await resend.emails.send({
      from: "MrLandlord <onboarding@resend.dev>",
      to: process.env.CLIENT_NOTIFICATION_EMAIL!,
      subject: "New Lead from MrLandlord Website",
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Portfolio Size:</strong> ${portfolioSize}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
