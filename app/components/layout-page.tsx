import Link from "next/link";
import type React from "react"; // Added import for React
import { NavigationBar } from "@/components/Navigaion-bar";
import { Toaster } from "./ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07c2cc] via-[#0061ff] to-[#000B24]">
            <Toaster />

      <div className="relative min-h-screen flex flex-col">
        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <NavigationBar />
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
            <p className="text-white/70">
              &copy; 2024 RemoveBG. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-white/70 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/70 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
