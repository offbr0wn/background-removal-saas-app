import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProviderComponent } from "./middleware/clerk-component-type";

export const metadata: Metadata = {
  title: "RB Remove Background - AI Background Removal",
  description: "Remove backgrounds for images instantly with AI precision",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3025338220182456"
        />
      </head>
      <ClerkProviderComponent
        afterSignOutUrl="/"
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/pricing"
      >
        <body>
          {children}
          <Analytics />
        </body>
      </ClerkProviderComponent>
    </html>
  );
}
