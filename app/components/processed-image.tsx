"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Facebook,
  ImageIcon,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

import { Card } from "./ui/card";
import { Download } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
interface ProcessedImageProps {
  processedImage: {
    format: string;
    input_image_url: string;
    result: string;
    size: {
      height: number;
      width: number;
    };
    mps: number;
    status: string;
  };
}

export function ProcessedImage({ processedImage }: ProcessedImageProps) {
  const [viewMode, setViewMode] = useState<"single" | "gallery" | "split">(
    "single"
  );

  const [isDownloading, setIsDownloading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const [copied, setCopied] = useState(false);

  const downloadImage = useCallback(async () => {
    setIsDownloading(true);
    if (!processedImage) return;
    try {
      const blob = processedImage.result.startsWith("data:image")
        ? await (async () => {
            const res = await fetch(processedImage.result);

            return res.blob();
          })()
        : await (await fetch(processedImage.result)).blob();

      const splitURLImage = processedImage.result.split("/");
      const filenameWithExtension = splitURLImage.pop();
      const fileName = filenameWithExtension?.split(".")[0];

      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), {
        href: url,
        download: fileName || "image",
      });

      document.body.appendChild(link);
      link.click();
      toast({
        duration: 2000,
        description: "Image downloaded successfully",
      });
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setTimeout(() => {
        setIsDownloading(false);
      }, 500);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [processedImage]);

  const copyImageToClipboard = useCallback(async () => {
    if (!processedImage) return;
    try {
      const blob = await fetch(processedImage.result).then((r) => r.blob());
      console.log("Blob:", blob);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      toast({
        duration: 2000,
        description: "Image copied to clipboard",
      });

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }, [processedImage]);

  const shareToSocialMedia = (platform: string) => {
    const text = encodeURIComponent(
      "Check out this image I created with RB Remove Background!"
    );
    const url = encodeURIComponent(processedImage.result);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&text=${text}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      toast({
        duration: 1000,
        title: "Opening share window",
        description: `Sharing to ${platform}`,
      });
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end items-center">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* <div className="flex bg-white  rounded-md p-1 ">
            <Button
              variant={viewMode === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("single")}
              className={
                viewMode === "single"
                  ? "bg-black text-white"
                  : "bg-transparent text-white"
              }
            >
              Single
            </Button>
            <Button
              variant={viewMode === "gallery" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("gallery")}
              className={
                viewMode === "gallery"
                  ? "bg-black text-white"
                  : "bg-transparent text-black font-bold"
              }
            >
              Gallery
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className={
                viewMode === "split"
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-black font-bold"
              }
            >
              Split
            </Button>
          </div> */}
        </div>
      </div>

      {viewMode === "single" && (
        <div className="grid md:grid-cols-6 gap-6">
          {/* Main Image Area - Takes up more space */}
          <div className="md:col-span-4 lg:col-span-4">
            <Card className="bg-white/8 backdrop-blur-sm border-white/20 overflow-hidden ">
              <Tabs defaultValue="result" className="w-full ">
                <div className="flex justify-between  p-4 border-b border-white/20">
                  <h2 className="text-5xl font-bold text-white">Result</h2>
                  <TabsList className="bg-white p-2 rounded-md space-x-2">
                    <TabsTrigger
                      value="result"
                      className="data-[state=active]:bg-black data-[state=active]:p-2 data-[state=active]:text-white  rounded-sm font-semibold text-sm  cursor-pointer"
                    >
                      Result
                    </TabsTrigger>
                    <TabsTrigger
                      value="original"
                      className="data-[state=active]:bg-black data-[state=active]:p-2 data-[state=active]:text-white rounded-sm font-semibold text-sm  cursor-pointer"
                    >
                      Original
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 flex justify-center items-center min-h-[400px]">
                  <TabsContent
                    value="result"
                    className="mt-0 w-full h-full flex justify-center"
                  >
                    <div className="relative w-full max-w-2xl">
                      {/* Transparent background pattern */}
                      <div className="absolute inset-0 rounded-lg  opacity-20"></div>

                      {/* Image with removed background */}
                      <div className="relative z-10 flex justify-center">
                        <img
                          ref={imageRef}
                          src={processedImage?.result}
                          alt="Processed image with background removed"
                          width={600}
                          className="object-contain max-h-[400px]"
                          // crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="original"
                    className="mt-0 w-full h-full flex justify-center"
                  >
                    <img
                      src={processedImage?.input_image_url}
                      alt="Original image before processing"
                      width={600}
                      className="object-contain max-h-[400px]"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Action Panel - Simplified and focused */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            {/* Download Card */}
            <Card className="bg-neutral-100 backdrop-blur-sm border-white/10 p-5 ">
              <h3 className="text-lg  text-black font-bold">Download</h3>

              <div className="space-y-3">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
                  onClick={downloadImage}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Share Card */}
            <Card className="bg-neutral-100 backdrop-blur-sm border-white/10 p-5">
              <h3 className="text-lg  text-black font-bold ">Share</h3>

              <div className="space-y-2">
                {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-black text-white border-white/20 hover:bg-black/70 hover:text-white gap-2"
                    >
                      <>
                        <Share2 className="w-4 h-4" />
                        Share Image
                      </>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 bg-white/10 backdrop-blur-md border-white/20">
                    <div className="grid gap-2">
                      <h4 className="font-medium text-white">Share to</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => shareToSocialMedia("facebook")}
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => shareToSocialMedia("twitter")}
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => shareToSocialMedia("linkedin")}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
                        onClick={copyImageToClipboard}
                      >
                        Share Now
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover> */}

                <Button
                  variant="outline"
                  className="w-full bg-black text-white border-white/20 hover:bg-black/70  hover:text-white gap-2"
                  onClick={copyImageToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Image Information Card */}
            <Card className="bg-neutral-100 backdrop-blur-sm border-white/10 p-5">
              <h3 className="text-lg font-bold text-black ">
                Image Information
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-black">Dimensions:</span>
                  <span className="text-black font-medium">
                    {processedImage?.size.width} x {processedImage?.size.height}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black">File Size:</span>
                  <span className="text-black font-medium">
                    {processedImage?.mps.toFixed(1)} MB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black">Format:</span>
                  <span className="text-black font-medium">
                    {processedImage?.format}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black">Created:</span>
                  <span className="text-black font-medium">
                    {new Date().toLocaleString().split(",")[0]}
                  </span>
                </div>
              </div>
            </Card>

            {/* Try Another Card */}
            <Card className="bg-neutral-100 backdrop-blur-sm border-white/10 p-5">
              <Button
                className="w-full gap-2 font-bold bg-black hover:bg-black/70 text-white"
                asChild
              >
                <Link href="/">
                  Process Another Image
                  <ImageIcon className="w-4 h-4 " />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
