import { Resend } from "resend";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "RESEND_API_KEY is not configured"
  );
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await resend.emails.send({
    from: "MrLandlord <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}

/**
 * Notify Company Admin
 */
export async function notifyCompanyAdmin(
  ctx: QueryCtx,
  params: {
    companyId: Id<"companies">;
    subject: string;
    html: string;
  }
): Promise<void> {
  const companyAdmin = await ctx.db
    .query("companyAdmins")
    .withIndex("by_company", (q) =>
      q.eq("companyId", params.companyId)
    )
    .first();

  if (!companyAdmin) return;

  await sendEmail(
    companyAdmin.email,
    params.subject,
    params.html
  );
}

/**
 * Notify Super Admin
 */
export async function notifySuperAdmin(
  ctx: QueryCtx,
  params: {
    subject: string;
    html: string;
  }
): Promise<void> {
  const superAdmin = await ctx.db
    .query("superAdmins")
    .filter((q) =>
      q.eq(q.field("role"), "super_admin")
    )
    .first();

  if (!superAdmin) return;

  await sendEmail(
    superAdmin.email,
    params.subject,
    params.html
  );
}

/**
 * Notify Tenant directly
 */
export async function notifyTenant(
  email: string,
  subject: string,
  html: string
): Promise<void> {
  await sendEmail(email, subject, html);
}
