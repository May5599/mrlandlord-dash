"use client";

import "./globals.css";
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("DEBUG CONVEX URL:", process.env.NEXT_PUBLIC_CONVEX_URL);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
