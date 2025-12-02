import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl bg-white dark:bg-black rounded-2xl shadow-sm">
        <Image
          src="/logo.svg"
          alt="MrLandlord logo"
          width={120}
          height={40}
          className="mb-6 dark:invert"
        />

        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Welcome to <span className="text-indigo-600">MrLandlord</span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
          Manage your properties, leads, and franchises effortlessly with one powerful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Property Manager Dashboard
          </Link>

          <Link
            href="/tenant"
            className="px-6 py-3 rounded-full border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50 transition-colors"
          >
            Tenant Portal
          </Link>
        </div>
      </main>

      <footer className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} MrLandlord. All rights reserved.
      </footer>
    </div>
  );
}
