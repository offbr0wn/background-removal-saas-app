"use client";
import { useEffect, useState } from "react";
import { UploadCard } from "./components/Upload-card";
import { FeatureHighlights } from "./components/feature-highlights";
import { NavigationBar } from "./components/Navigaion-bar";
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "./components/ui/loading-spinner";

export default function Home() {



  // if (!message)
  //   return (
  //     <main className="bg-black h-screen flex items-center justify-center">
  //     <LoadingSpinner />
  //   </main>
  // )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07c2cc] via-[#0061ff] to-[#000B24] overflow-hidden">
      {/* Pattern Overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Navigation */}
        <header>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <NavigationBar />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6">
          <div className="min-h-[80vh] grid lg:grid-cols-2 gap-16 items-center py-12">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>AI-Powered Background Removal</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Remove backgrounds with AI precision
              </h1>

              <p className="text-lg text-white/70 max-w-lg">
                Transform your images instantly with our advanced AI technology. Perfect for e-commerce, marketing, and
                design professionals.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white hover:bg-white/90 text-black rounded-full px-8">
                  Start for free
                  {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-white/10 text-white hover:bg-white/10"
                >
                  {/* <PlayCircle className="mr-2 h-5 w-5" /> */}
                  Watch demo
                </Button>
              </div>

              <FeatureHighlights />
            </div>

            {/* Right Column - Upload Card */}
            <div className="flex md:justify-end justify-center">
              <UploadCard />
            </div>
          </div>

          {/* Trusted By Section */}
          {/* <TrustedBy /> */}
        </main>
      </div>
    </div>
  )
}
