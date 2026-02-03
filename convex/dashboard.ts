import { query } from "./_generated/server";
import { v } from "convex/values";
import { getCompanyIdFromToken } from "./_lib/getCompanyFromToken";

export const getCompanyDashboardStats = query({
  args: {
    token: v.string(),
  },

  handler: async (ctx, { token }) => {
    const companyId = await getCompanyIdFromToken(ctx, token);

    const [properties, units, maintenance] = await Promise.all([
      ctx.db
        .query("properties")
        .withIndex("by_company", q => q.eq("companyId", companyId))
        .collect(),

      ctx.db
        .query("units")
        .withIndex("by_company", q => q.eq("companyId", companyId))
        .collect(),

      ctx.db
        .query("maintenance")
        .filter(q => q.eq(q.field("companyId"), companyId))
        .collect(),
    ]);

    /* -------------------------
       Summary counts
    -------------------------- */
    const totalProperties = properties.length;
    const totalUnits = units.length;

    const occupiedUnits = units.filter(u => u.status === "occupied").length;
    const vacantUnits = units.filter(u => u.status === "vacant").length;
    const maintenanceUnits = units.filter(u => u.status === "maintenance").length;

    const openMaintenance = maintenance.filter(
      m => m.status === "open" || m.status === "in-progress"
    ).length;

    /* -------------------------
       Maintenance by status
    -------------------------- */
    const maintenanceByStatus = Object.values(
      maintenance.reduce((acc: any, m) => {
        acc[m.status] = acc[m.status] || {
          status: m.status,
          count: 0,
        };
        acc[m.status].count++;
        return acc;
      }, {})
    );

    /* -------------------------
       Maintenance by category
    -------------------------- */
    const maintenanceByCategory = Object.values(
      maintenance.reduce((acc: any, m) => {
        acc[m.category] = acc[m.category] || {
          category: m.category,
          count: 0,
        };
        acc[m.category].count++;
        return acc;
      }, {})
    );

    /* -------------------------
       Monthly maintenance trend
    -------------------------- */
    const currentYear = new Date().getFullYear();

const monthlyMaintenance = Object.values(
  maintenance.reduce((acc: any, m) => {
    const date = new Date(m.createdAt);

    if (date.getFullYear() !== currentYear) {
      return acc;
    }

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    acc[month] = acc[month] || {
      month,
      count: 0,
    };

    acc[month].count++;
    return acc;
  }, {})
);


    return {
      summary: {
        totalProperties,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        openMaintenance,
      },
      charts: {
        occupancy: [
          { name: "Occupied", value: occupiedUnits },
          { name: "Vacant", value: vacantUnits },
          { name: "Maintenance", value: maintenanceUnits },
        ],
        maintenanceByStatus,
        maintenanceByCategory,
        monthlyMaintenance,
      },
    };
  },
});
