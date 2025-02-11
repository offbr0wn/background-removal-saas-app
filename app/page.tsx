"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FeatureHighlights } from "@/components/feature-highlights"; // Corrected import path
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner"; // Corrected import path
import { NavigationBar } from "@/components/Navigaion-bar";
import { UploadCard } from "@/components/Upload-card";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate any initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="bg-black h-screen flex items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.19, 1.0, 0.22, 1.0],
      },
    },
  };

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
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <NavigationBar />
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6">
          <div className="min-h-[80vh] grid lg:grid-cols-2 gap-16 items-center py-12">
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={item}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm text-sm font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>AI-Powered Background Removal</span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
              >
                Remove backgrounds with AI precision
              </motion.h1>

              <motion.p
                variants={item}
                className="text-lg text-white/70 max-w-lg"
              >
                Transform your images instantly with our advanced AI technology.
                Perfect for e-commerce, marketing, and design professionals.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white hover:bg-white/90 text-black rounded-full px-8"
                >
                  Start for free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-white/10 text-white hover:bg-white/10"
                >
                  Watch demo
                </Button>
              </motion.div>

              <motion.div variants={item}>
                <FeatureHighlights />
              </motion.div>
            </motion.div>

            {/* Right Column - Upload Card */}
            <motion.div
              className="flex md:justify-end justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <UploadCard />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
