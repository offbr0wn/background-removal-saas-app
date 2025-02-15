import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProviderComponent } from "./lib/clerk-component-type";
import { Suspense } from "react";
import { LoadingSpinner } from "./components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "RemoveBG - AI Background Removal",
  description: "Remove backgrounds from images instantly with AI precision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
    <ClerkProviderComponent>
      <html lang="en">
        <body>
          {children}
          <Toaster position="bottom-right" />
          <Analytics />
        </body>
      </html>
      </ClerkProviderComponent>
    </Suspense>
  );
}
