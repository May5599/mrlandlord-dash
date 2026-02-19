

// "use client";

// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="relative min-h-screen flex flex-col bg-white overflow-hidden">

//       {/* Background Atmosphere */}
//       <div className="absolute inset-0 -z-10">
//         <img
//           src="/Mrlandlord.ca_FAW.svg"
//           alt="Property Background"
//           className="w-full h-full object-cover opacity-20"
//         />
//         <div className="absolute inset-0 bg-white/80" />
//       </div>

//       {/* Top Right Admin Button */}
//       <div className="absolute top-8 right-8">
//         <Link
//           href="/admin"
//           className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow hover:border-indigo-400 hover:text-indigo-600 transition"
//         >
//           Admin Panel
//         </Link>
//       </div>

//       {/* HERO SECTION */}
//       <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">

//         <div className="max-w-4xl mx-auto">

//           <Image
//             src="/Mrlandlord.ca_FAW.svg"
//             alt="MrLandlord logo"
//             width={260}
//             height={80}
//             className="mx-auto mb-10"
//           />

//           <h1 className="text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
//             Property Management
//             <br />
//             <span className="text-indigo-600">
//               Simplified & Centralized
//             </span>
//           </h1>

//           <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//             A modern platform to manage properties, streamline tenant communication,
//             automate maintenance tracking, and scale franchise operations  
//             all from one unified dashboard.
//           </p>

//           <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">

//             <Link
//               href="/login"
//               className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition"
//             >
//               Property Manager Dashboard
//             </Link>

//             <Link
//               href="/tenant/login"
//               className="px-8 py-4 rounded-2xl border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 transition"
//             >
//               Tenant Portal
//             </Link>

//           </div>
//         </div>
//       </main>

//       {/* FEATURES SECTION */}
//       <section className="py-24 px-6 bg-gray-50">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">

//           <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition">
//             <h3 className="text-lg font-semibold mb-3">
//               Centralized Management
//             </h3>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Manage multiple properties, tenants, and vendors
//               from a single intuitive control panel.
//             </p>
//           </div>

//           <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition">
//             <h3 className="text-lg font-semibold mb-3">
//               Smart Maintenance Tracking
//             </h3>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Track requests in real time, assign vendors,
//               and maintain complete service history.
//             </p>
//           </div>

//           <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition">
//             <h3 className="text-lg font-semibold mb-3">
//               Franchise Ready
//             </h3>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Built for scalability with structured reporting,
//               performance analytics, and multi-branch control.
//             </p>
//           </div>

//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="py-8 text-center text-sm text-gray-500 border-t">
//         © {new Date().getFullYear()} MrLandlord. All rights reserved.
//       </footer>

//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-hidden isolate">

      {/* Soft Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />

      {/* Subtle Glow Effects */}
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[140px] opacity-40 -z-10" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[140px] opacity-40 -z-10" />

      {/* Top Navigation */}
      <header className="w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <Image
          src="/Mrlandlord.ca_FAW .svg"
          alt="MrLandlord Logo"
          width={180}
          height={50}
          priority
        />

        <Link
          href="/admin"
          className="px-5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition"
        >
          Admin Panel
        </Link>
      </header>

      {/* HERO */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-24">

        <div className="max-w-4xl">

          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-tight">
            Property Management
            <br />
            <span className="text-indigo-600">
              Built for Modern Operators
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage properties, track tenants, handle maintenance requests,
            and scale franchise operations   all from one centralized,
            enterprise-ready dashboard.
          </p>

          {/* Primary CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">

            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-all hover:scale-[1.02]"
            >
              Property Manager Dashboard
            </Link>

            <Link
              href="/tenant/login"
              className="px-8 py-4 rounded-2xl border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 transition-all hover:scale-[1.02]"
            >
              Tenant Portal
            </Link>

          </div>

          {/* Trust Line */}
          <p className="mt-10 text-sm text-gray-500">
            Trusted by property managers & franchise operators
          </p>

        </div>
      </main>

      {/* FEATURE GRID */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <FeatureCard
            title="Centralized Control"
            description="Manage multiple properties, tenants, and vendors
            from a single streamlined control panel."
          />

          <FeatureCard
            title="Smart Maintenance Workflow"
            description="Track issues in real time, assign vendors,
            monitor progress, and maintain complete service history."
          />

          <FeatureCard
            title="Scalable Infrastructure"
            description="Designed for multi-branch operators with reporting,
            oversight tools, and structured performance tracking."
          />

        </div>
      </section>

      {/* SECONDARY SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-semibold text-gray-900">
            Designed for Growth
          </h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto">
            Whether you manage 10 units or 1,000,
            MrLandlord gives you the operational clarity
            and structure needed to scale confidently.
          </p>

          <Link
            href="/contactpage"
            className="inline-block mt-10 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition"
          >
            Get Started Today
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} MrLandlord. All rights reserved.
      </footer>

    </div>
  );
}

/* ========================= */
/* Reusable Feature Card */
/* ========================= */

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
