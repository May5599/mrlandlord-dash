// "use node";

// import { action } from "./_generated/server";
// import { api } from "./_generated/api";
// import { Resend } from "resend";
// import crypto from "crypto";
// import { v } from "convex/values";

// export const requestOtp = action({
//   args: { email: v.string() },
//   handler: async (ctx, { email }) => {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = Date.now() + 5 * 60 * 1000;

//     await ctx.runMutation(api.tenantsAuth.saveOtp, {
//       email,
//       otp,
//       otpExpiresAt: expiresAt,
//     });

//     const resend = new Resend(process.env.RESEND_API_KEY);
//     await resend.emails.send({
//       from: "acme@resend.dev",
//       to: email,
//       subject: "Tenant Login Code",
//       text: `Your login code is ${otp}`,
//     });

//     return { success: true };
//   },
// });
