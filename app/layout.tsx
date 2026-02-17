// "use client";

// import "./globals.css";
// import { ConvexProvider } from "convex/react";
// import { ConvexReactClient } from "convex/react";

// const convex = new ConvexReactClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// export default function RootLayout({
  
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   console.log("DEBUG CONVEX URL:", process.env.NEXT_PUBLIC_CONVEX_URL);

//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-50">
//         <ConvexProvider client={convex}>
//           {children}
//         </ConvexProvider>
//       </body>
//     </html>
//   );
// }
"use client";

import "./globals.css";
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mr Landlord Dashboard",
  description: "Property and franchise management dashboard",
};

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
