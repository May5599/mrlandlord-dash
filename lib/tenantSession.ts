// // import { cookies } from "next/headers";
// // import { fetchQuery } from "convex/nextjs";
// // import { api } from "@/convex/_generated/api";

// // export async function getTenantSession() {
// //   try {
// //     const cookieStore = await cookies();
// //     const session = cookieStore.get("tenant_session");

// //     if (!session) return null;

// //     const tenant = await fetchQuery(api.tenantSessions.validateSession, {
// //       token: session.value,
// //     });

// //     if (!tenant) return null;

// //     return tenant;
// //   } catch (err) {
// //     console.error("SESSION ERROR:", err);
// //     return null;
// //   }
// // }

// import { cookies } from "next/headers";
// import { api } from "@/convex/_generated/api";
// import { fetchQuery } from "convex/nextjs";

// export async function getTenantSession() {
//   const cookie = cookies().get("tenant_session");
//   if (!cookie) return null;

//   const tenant = await fetchQuery(api.tenantSessions.validateSession, {
//     token: cookie.value
//   });

//   return tenant;
// }
