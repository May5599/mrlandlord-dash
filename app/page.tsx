// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl bg-white dark:bg-black rounded-2xl shadow-sm">
//         <Image
//           src="/logo.jpg"
//           alt="MrLandlord logo"
//           width={120}
//           height={40}
//           className="mb-6 dark:invert"
//         />

//         <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
//           Welcome to <span className="text-indigo-600">MrLandlord</span>
//         </h1>

//         <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
//           Manage your properties, leads, and franchises effortlessly with one powerful dashboard.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <Link
//             href="/login"
//             className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
//           >
//             Property Manager Dashboard
//           </Link>

//           <Link
//             href="/tenant/login"
//             className="px-6 py-3 rounded-full border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 transition-colors"
//           >
//             Tenant Portal
//           </Link>
//         </div>
//       </main>

//       <footer className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
//         © {new Date().getFullYear()} MrLandlord. All rights reserved.
//       </footer>
//     </div>
//   );
// }
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">

      {/* Top Right Admin Button */}
      {/* Top Right Admin Button */}
<div className="absolute top-6 right-6">
  <Link
    href="/admin"
    className="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 hover:border-indigo-300 hover:text-indigo-600 transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
  >
    Admin Panel
  </Link>
</div>


      {/* Center Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-10">

          <Image
            src="/logo.jpg"
            alt="MrLandlord logo"
            width={230}
            height={100}
            className="mx-auto mb-6 dark:invert"
          />

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Welcome to <span className="text-indigo-600">MrLandlord</span>
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Manage properties, track tenants, handle maintenance requests, and grow your franchise operations   all from one centralized dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Property Manager Dashboard
            </Link>

            <Link
              href="/tenant/login"
              className="px-6 py-3 rounded-lg border border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-50 transition-colors dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              Tenant Portal
            </Link>
          </div>

          {/* Subtle Features Section */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Centralized Management
              </h3>
              <p className="text-xs text-muted-foreground">
                View and manage all properties from one unified interface.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Tenant Tracking
              </h3>
              <p className="text-xs text-muted-foreground">
                Track leases, rent status, and communications efficiently.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Franchise Scaling
              </h3>
              <p className="text-xs text-muted-foreground">
                Expand operations with structured reporting and insights.
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="pb-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MrLandlord. All rights reserved.
      </footer>
    </div>
  );
}
