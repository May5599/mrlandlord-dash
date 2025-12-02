// "use node";

// import { action } from "./_generated/server";
// import { api } from "./_generated/api";
// import crypto from "crypto";
// import { v } from "convex/values";

// export const createSession = action({
//   args: { tenantId: v.id("tenants") },
//   handler: async (ctx, { tenantId }) => {
//     const token = crypto.randomBytes(32).toString("hex");
//     const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

//     await ctx.runMutation(api.tenantSessions.writeSession, {
//       tenantId,
//       token,
//       expiresAt,
//     });

//     return { token };
//   },
// });
// // 