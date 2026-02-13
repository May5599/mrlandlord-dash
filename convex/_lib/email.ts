import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  await resend.emails.send({
    from: "MrLandlord <onboarding@resend.dev>",
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}
