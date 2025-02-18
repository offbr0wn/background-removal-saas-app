import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
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
    <html lang="en">
      <ClerkProviderComponent afterSignOutUrl="/">
        <body>
          {children}
          <Analytics />
        </body>
      </ClerkProviderComponent>
    </html>
  );
}
