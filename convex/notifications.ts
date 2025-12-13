// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";
// import { api } from "./_generated/api";
// // -----------------------------------------------
// // Shared helper to load companyId from auth
// // -----------------------------------------------
// // async function getCompanyId(ctx: any) {
// //   const identity = await ctx.auth.getUserIdentity();
// //   if (!identity) throw new Error("Unauthorized");

// //   // identity.subject is the companyId we use everywhere
// //   return identity.subject;
// // }

// async function getCompanyId(ctx: any) {
//   // TEMPORARY DEV MODE: always use your known company
//   return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
// }


// /* -----------------------------------------------------
//    1. CREATE NOTIFICATION (Internal system event)
// ------------------------------------------------------ */
// export const createNotification = mutation({
//   args: {
//     type: v.string(),                    // "vendor_assigned", "status_updated", etc.
//     message: v.string(),                 // readable message
//     maintenanceId: v.id("maintenance"),  // link to request

//     vendorId: v.optional(v.id("vendors")),
//     tenantId: v.optional(v.id("tenants")),
//     status: v.optional(v.string()),      // request status (optional)
//   },

//   handler: async (ctx, args) => {
//     const companyId = await getCompanyId(ctx);

// //    await ctx.db.insert("notifications", {
// //   ...args,
// //   companyId,
// //   read: false,                                // 🔥 default unread
// //   createdAt: new Date().toISOString(),
// // });


// //     return { success: true };

// await ctx.db.insert("notifications", {
//   ...args,
//   companyId,
//   read: false,
//   createdAt: new Date().toISOString(),
// });

// // --- EMAIL ALERT LOGIC ---
// let recipientEmail = null;

// if (args.vendorId) {
//   const vendor = await ctx.db.get(args.vendorId);
//   recipientEmail = vendor?.email;
// }

// if (args.tenantId) {
//   const tenant = await ctx.db.get(args.tenantId);
//   recipientEmail = tenant?.email;
// }

// // Manager email: You decide how to store it
// const managerEmail = "manager@company.com"; // TEMP for now

// // If nothing else, default to manager
// if (!recipientEmail) {
//   recipientEmail = managerEmail;
// }

// // Trigger Convex email mutation
// await ctx.runMutation(api.sendEmail, {
//   to: recipientEmail,
//   subject: `Maintenance Update: ${args.type}`,
//   text: args.message,
// });

// return { success: true };

//   },
// });

// /* -----------------------------------------------------
//    2. GET Notifications for Manager Dashboard
// ------------------------------------------------------ */
// export const getCompanyNotifications = query({
//   handler: async (ctx) => {
//     const companyId = await getCompanyId(ctx);

//     return await ctx.db
//       .query("notifications")
//       .withIndex("by_company", (q) => q.eq("companyId", companyId))
//       .order("desc")
//       .collect();
//   },
// });

// export const markAsRead = mutation({
//   args: { id: v.id("notifications") },

//   handler: async (ctx, { id }) => {
//     const companyId = await getCompanyId(ctx);
//     const notif = await ctx.db.get(id);

//     if (!notif || notif.companyId !== companyId) {
//       throw new Error("Unauthorized");
//     }

//     await ctx.db.patch(id, { read: true });
//     return true;
//   },
// });


// // export const getUnreadCount = query({
// //   handler: async (ctx) => {
// //     const companyId = await getCompanyId(ctx);

// //     return await ctx.db
// //       .query("notifications")
// //       .withIndex("by_company", (q) => q.eq("companyId", companyId))
// //       .filter((q) => q.eq(q.field("read"), false))
// //       .collect()
// //       .then((rows) => rows.length);
// //   },
// // });

// export const getUnreadCount = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return 0;

//     const companyId = identity.subject;

//     return await ctx.db
//       .query("notifications")
//       .withIndex("by_company", (q) => q.eq("companyId", companyId))
//       .filter((q) => q.eq(q.field("read"), false))
//       .collect()
//       .then((list) => list.length);
//   },
// });

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// -----------------------------------------------------
// TEMPORARY: Hardcoded companyId for dev mode
// -----------------------------------------------------
async function getCompanyId(ctx: any) {
  return "k97fye4pz7v4d1tey4bp6dsvj17x4k9v";
}

/* -----------------------------------------------------
   CREATE NOTIFICATION + EMAIL ALERT
------------------------------------------------------ */
export const createNotification = mutation({
  args: {
    type: v.string(),
    message: v.string(),
    maintenanceId: v.id("maintenance"),

    vendorId: v.optional(v.id("vendors")),
    tenantId: v.optional(v.id("tenants")),
    status: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const companyId = await getCompanyId(ctx);

    // store notification
    await ctx.db.insert("notifications", {
      ...args,
      companyId,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // pick email recipient
    let recipientEmail = null;

    if (args.vendorId) {
      const vendor = await ctx.db.get(args.vendorId);
      recipientEmail = vendor?.email;
    }

    if (args.tenantId) {
      const tenant = await ctx.db.get(args.tenantId);
      recipientEmail = tenant?.email;
    }

    // fallback manager
    const managerEmail = "mayankcan999@gmail.com";
    if (!recipientEmail) {
      recipientEmail = managerEmail;
    }

    // send email
    // await ctx.runMutation(api.sendEmail, {
    //   to: recipientEmail,
    //   subject: `Maintenance Update: ${args.type}`,
    //   text: args.message,
    // });

    await ctx.runMutation(api.sendEmail.sendEmail, {
  to: recipientEmail,
  subject: `Maintenance Update: ${args.type}`,
  text: args.message,
});


    return { success: true };
  },
});

/* -----------------------------------------------------
   LOAD ALL NOTIFICATIONS FOR MANAGER PANEL
------------------------------------------------------ */
export const getCompanyNotifications = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    return await ctx.db
      .query("notifications")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .order("desc")
      .collect();
  },
});

/* -----------------------------------------------------
   MARK NOTIFICATION AS READ
------------------------------------------------------ */
export const markAsRead = mutation({
  args: { id: v.id("notifications") },

  handler: async (ctx, { id }) => {
    const companyId = await getCompanyId(ctx);
    const notif = await ctx.db.get(id);

    if (!notif || notif.companyId !== companyId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { read: true });
    return true;
  },
});

/* -----------------------------------------------------
   UNREAD COUNT FOR SIDEBAR BADGE
------------------------------------------------------ */
export const getUnreadCount = query({
  handler: async (ctx) => {
    const companyId = await getCompanyId(ctx);

    const list = await ctx.db
      .query("notifications")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    return list.length;
  },
});
