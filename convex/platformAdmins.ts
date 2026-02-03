import { query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";
import { getTenantFromToken } from "./_lib/getTenantFromToken";

const PLATFORM_ADMINS = [
  "founder@mrlandlord.com",
  "admin@mrlandlord.com",
];

export const verifyPlatformAdmin = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, { token }) => {
    // reuse your existing auth flow
    const auth = await getTenantFromToken(ctx, token);

    const email = auth.tenant.email;

    if (!PLATFORM_ADMINS.includes(email)) {
      return { allowed: false };
    }

    return {
      allowed: true,
      email,
    };
  },
});
