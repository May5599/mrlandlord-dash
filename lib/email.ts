import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendLoginEmail(params: {
  to: string;
  email: string;
  password: string;
}) {
  await resend.emails.send({
    from: "MrLandlord <onboarding@resend.dev>",
    to: params.to,
    subject: "Your MrLandlord Admin Access",
    html: `
      <h2>Admin Access Created</h2>
      <p>Your login details:</p>
      <p><strong>Email:</strong> ${params.email}</p>
      <p><strong>Password:</strong> ${params.password}</p>
      <p>Please login and change your password immediately.</p>
    `,
  });
}
