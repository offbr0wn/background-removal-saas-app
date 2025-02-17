"use client";

import { NavigationBar } from "@/components/Navigaion-bar";
import { ProcessedImage } from "@/components/processed-image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getBackgroundRemovalImage } from "@/api/helpers/removeBackground";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

function Page({ params }: { params: { slug: number } }) {
  const [backgroundRemovalLink, setBackgroundRemovalLink] = useState(null);

  useEffect(() => {
    // Poll the API every 2 seconds
    const intervalId = setInterval(async () => {
      const processedImage = await getBackgroundRemovalImage(params.slug);
      if (processedImage?.status === "DONE") {
        setBackgroundRemovalLink(processedImage?.result);
        toast({
          duration: 2000,
          description: "Background removed successfully",
        });
        clearInterval(intervalId); // Stop polling once we have a valid image URL
      }
    }, 2000);

    // Clean up the interval on component unmount or when params.slug changes
    return () => clearInterval(intervalId);
  }, [params.slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07c2cc] via-[#3216ea] to-[#000B24] overflow-hidden">
      {/* Pattern Overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative">
        <header>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <NavigationBar />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 pt-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-5 text-white hover:text-white/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="grid md:grid-rows-1 gap-2 justify-center items-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              Remove Image Background
            </h1>
            <div>
              {backgroundRemovalLink ? (
                <ProcessedImage processedImage={backgroundRemovalLink} />
              ) : (
                <div className="text-center text-white/70  flex items-center justify-center pt-[20vh]">
                  <h1 className="text-4xl font-bold mb-4">
                    <LoadingSpinner />
                  </h1>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
