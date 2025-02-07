import { NavigationBar } from "@/components/Navigaion-bar";
import { ProcessedImage } from "@/components/processed-image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A1C71] via-[#D76D77] to-[#FFAF7B]">
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

        <main className="max-w-7xl mx-auto px-6 py-12">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-8 text-white hover:text-white/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-8">
            Remove Image Background
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {/* <UploadCard
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                processedImage={processedImage}
              /> */}
            </div>
            <div>
              <ProcessedImage />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
