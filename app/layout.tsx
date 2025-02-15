import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { ClerkProviderComponent } from "./middleware/clerk-component-type";

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
    <ClerkProviderComponent>
      <html lang="en">
        <body>
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          <Toaster position="bottom-right" />
          <Analytics />
        </body>
      </html>
    </ClerkProviderComponent>
  );
}
