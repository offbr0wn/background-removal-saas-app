import { Zap, Image, Clock } from "lucide-react"

export function FeatureHighlights() {
  const features = [
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Process images in seconds",
    },
    {
      icon: <Image className="h-4 w-4" />,
      text: "High-resolution output",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      text: "Batch processing available",
    },
  ]

  return (
    <div className="flex flex-nowrap gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 text-[60%] text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2"
        >
          {feature.icon}
          <span >{feature.text}</span>
        </div>
      ))}
    </div>
  )
}

