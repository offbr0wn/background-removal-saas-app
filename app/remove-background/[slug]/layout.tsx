"use client";

import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Toaster />
      <body>{children}</body>
    </html>
  );
}
