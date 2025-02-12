"use client"

import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  alt: string
}

export function BeforeAfterSlider({ beforeImage, afterImage, alt }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      setSliderPosition((x / rect.width) * 100)
    },
    [isDragging],
  )

  return (
    <div
      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')]"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Original Image */}
      <div className="absolute inset-0">
        <img src={beforeImage || "/placeholder.svg"} alt={`${alt} - Before`} className="w-full h-full object-cover" />
      </div>

      {/* Processed Image */}
      <div className="absolute top-0 bottom-0 left-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img
          src={afterImage || "/placeholder.svg"}
          alt={`${alt} - After`}
          className="absolute top-0 left-0 h-full object-cover"
          style={{ width: `${100 * (100 / sliderPosition)}%` }}
        />
      </div>

      {/* Slider Handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize" style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <ChevronLeft className="w-4 h-4 text-black" />
              <ChevronRight className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm">Original</div>
        <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm">Processed</div>
      </div>
    </div>
  )
}

