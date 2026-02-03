import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import bcrypt from "bcryptjs";

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
    // 4. Return temp password to admin
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
