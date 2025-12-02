import Link from "next/link"; export default function TenantLayout({ children }: { children: React.ReactNode }) { return ( <div className="min-h-screen flex bg-gray-50"> {/* Sidebar */} <aside className="w-64 bg-white border-r p-6"> <h2 className="text-xl font-semibold mb-6">Tenant Portal</h2> <nav className="flex flex-col gap-3"> <Link className="text-gray-700 hover:text-indigo-600" href="/tenant/dashboard"> Dashboard </Link> <Link className="text-gray-700 hover:text-indigo-600" href="/tenant/profile"> Profile </Link> <Link className="text-gray-700 hover:text-indigo-600" href="/tenant/maintenance"> Request Maintenance </Link> <Link className="text-gray-700 hover:text-indigo-600" href="/tenant/payments"> Payments </Link> <Link className="text-gray-700 hover:text-indigo-600" href="/tenant/documents"> Documents </Link> </nav> </aside> {/* Main Content */} <main className="flex-1 p-10"> {children} </main> </div> ); }
// import { getTenantSession } from "@/lib/tenantSession";
// import { redirect } from "next/navigation";
// import Link from "next/link";

// export default async function TenantLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // ------------------------
//   // Validate session (server-side)
//   // ------------------------
//   const tenant = await getTenantSession();

//   // No session → redirect to login
//   if (!tenant) redirect("/tenant/login");

//   return (
//     <div className="min-h-screen flex bg-gray-50">

//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-6">
//         <h2 className="text-xl font-semibold mb-6">
//           Welcome, {tenant.name}
//         </h2>

//         <nav className="flex flex-col gap-3">
//           <Link
//             className="text-gray-700 hover:text-indigo-600"
//             href="/tenant/dashboard"
//           >
//             Dashboard
//           </Link>
//           <Link
//             className="text-gray-700 hover:text-indigo-600"
//             href="/tenant/profile"
//           >
//             Profile
//           </Link>
//           <Link
//             className="text-gray-700 hover:text-indigo-600"
//             href="/tenant/maintenance"
//           >
//             Request Maintenance
//           </Link>
//           <Link
//             className="text-gray-700 hover:text-indigo-600"
//             href="/tenant/payments"
//           >
//             Payments
//           </Link>
//           <Link
//             className="text-gray-700 hover:text-indigo-600"
//             href="/tenant/documents"
//           >
//             Documents
//           </Link>
//           <Link
//             className="text-gray-700 hover:text-red-600 mt-4"
//             href="/tenant/logout"
//           >
//             Logout
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10">
//         {children}
//       </main>
//     </div>
//   );
// }
