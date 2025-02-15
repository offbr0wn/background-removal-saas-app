"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Image, Clock, Lock, Wand2, Layers, Palette } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Layout } from "@/components/layout-page"

export default function FeaturesPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Remove backgrounds in seconds with our advanced AI technology.",
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "High Quality Output",
      description: "Get high-resolution images with clean edges and precise details.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Bulk Processing",
      description: "Process multiple images at once to save time and boost productivity.",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your images are processed securely and never stored on our servers.",
    },
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: "AI-Powered",
      description: "Utilizes cutting-edge machine learning for precise and intelligent results.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Preserve Transparency",
      description: "Maintain alpha channels in your images for seamless integration.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Custom Backgrounds",
      description: "Easily add new backgrounds to your images after removal.",
    },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#07c2cc] via-[#0061ff] to-[#000B24]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-4">Powerful Features</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover how our AI-powered tool simplifies background removal and enhances your workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full transition-all duration-300 group hover:bg-white/20">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white ml-4">{feature.title}</h3>
                  </div>
                  <p className="text-white/70 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredFeature === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-24 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your images?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven background removal and elevate your visual content.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white hover:bg-white/90 text-black rounded-full px-8 py-6 text-lg cursor-pointer">
                Start Removing Backgrounds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

