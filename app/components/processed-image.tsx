"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ProcessedImageProps {
  uploadedImage: string | null;
  processedImage: string | null;
}

export function ProcessedImage({
  uploadedImage,
  processedImage,
}: ProcessedImageProps) {
  const [sliderPosition, setSliderPosition] = useState(0);

  useEffect(() => {
    if (processedImage) {
      setSliderPosition(100); // Reset slider when new image is processed
    }
  }, [processedImage]);

  const downloadImage = useCallback(async () => {
    if (!processedImage) return;

    try {
      const blob = processedImage.startsWith("data:image")
        ? await (async () => {
            const res = await fetch(processedImage);

            return res.blob();
          })()
        : await (await fetch(processedImage)).blob();

      const splitURLImage = processedImage.split("/");
      const filenameWithExtension = splitURLImage.pop();
      const fileName = filenameWithExtension?.split(".")[0];
      console.log(fileName);
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), {
        href: url,
        download: fileName || "image",
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [processedImage]);

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Result</h2>
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
        {/* <img
          src={
            uploadedImage ||
            "https://archive.org/download/placeholder-image/placeholder-image.jpg"
          }
          alt="Original"
          className="absolute top-0 left-0 w-full h-full object-cover"
        /> */}
        {processedImage && (
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={processedImage || "/placeholder.svg"}
              alt="Processed"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        )}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        ></div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="w-full mb-4"
      />
      <Button
        className="w-full bg-white hover:bg-white/90 text-black cursor-pointer"
        disabled={!processedImage}
        onClick={downloadImage}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Removed Image
      </Button>
    </div>
  );
}
