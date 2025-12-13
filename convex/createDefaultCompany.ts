import { mutation } from "./_generated/server";

export const createDefaultCompany = mutation({
  handler: async (ctx) => {
    const id = await ctx.db.insert("companies", {
      name: "dev_company",
      managerName: "Dev Manager",
      managerEmail: "dev@company.com",
      createdAt: new Date().toISOString(),
    });

    return id;
  },
});
