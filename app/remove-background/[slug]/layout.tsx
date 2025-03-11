"use client";

import AdSense from "@/components/AdSense";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <AdSense pId="pub-3025338220182456" />
      </head>
      <Toaster />
      <body>{children}</body>
    </html>
  );
}
