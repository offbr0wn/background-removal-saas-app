"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ProcessedImageProps {
  uploadedImage: string | null
  processedImage: string | null
}

export function ProcessedImage({ uploadedImage, processedImage }: ProcessedImageProps) {
  const [sliderPosition, setSliderPosition] = useState(50)

  useEffect(() => {
    if (processedImage) {
      setSliderPosition(50) // Reset slider when new image is processed
    }
  }, [processedImage])

  if (!uploadedImage) {
    return (
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 h-full flex items-center justify-center">
        <p className="text-white/70 text-lg">Upload an image to see the result here</p>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Result</h2>
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
        <img
          src={uploadedImage || "/placeholder.svg"}
          alt="Original"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {processedImage && (
          <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${sliderPosition}%` }}>
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
      <Button className="w-full bg-white hover:bg-white/90 text-black" disabled={!processedImage}>
        <Download className="mr-2 h-4 w-4" />
        Download Result
      </Button>
    </div>
  )
}

