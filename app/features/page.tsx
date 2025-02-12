import { Layout } from "@/components/layout-page"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Image, Clock, Lock, Wand2, Layers, Palette } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Remove backgrounds in seconds with our advanced AI",
    },
    {
      icon: <Image className="h-6 w-6 text-blue-400" />,
      title: "High Quality Output",
      description: "Get high-resolution images with clean edges",
    },
    {
      icon: <Clock className="h-6 w-6 text-green-400" />,
      title: "Bulk Processing",
      description: "Process multiple images at once to save time",
    },
    {
      icon: <Lock className="h-6 w-6 text-red-400" />,
      title: "Secure & Private",
      description: "Your images are processed securely and never stored",
    },
    {
      icon: <Wand2 className="h-6 w-6 text-purple-400" />,
      title: "AI-Powered",
      description: "Utilizes cutting-edge machine learning for precise results",
    },
    {
      icon: <Layers className="h-6 w-6 text-orange-400" />,
      title: "Preserve Transparency",
      description: "Maintain alpha channels in your images",
    },
    {
      icon: <Palette className="h-6 w-6 text-pink-400" />,
      title: "Custom Backgrounds",
      description: "Add new backgrounds to your images with ease",
    },
    {
      icon: <ArrowRight className="h-6 w-6 text-indigo-400" />,
      title: "API Access",
      description: "Integrate our tool into your own applications",
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Powerful Features</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/remove-background#upload">
            <Button size="lg" className="bg-white hover:bg-white/90 text-black">
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

