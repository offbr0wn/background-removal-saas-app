"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BeforeAfterSlider } from "@/components/ui/before-after";

export default function ExamplesPage() {
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    {
      title: "Portrait Photography",
      description:
        "Perfect for professional headshots and social media profiles",
      before:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jfYJ33HcnRO9gSOGSbMmQyCz6ch7L0.png",
      after:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jfYJ33HcnRO9gSOGSbMmQyCz6ch7L0.png", // Using same image for demo
      category: "Portrait",
    },
    {
      title: "Product Photography",
      description: "Ideal for e-commerce and product catalogs",
      before: "/placeholder.svg?height=600&width=800",
      after: "/placeholder.svg?height=600&width=800",
      category: "Product",
    },
    {
      title: "Fashion Photography",
      description: "Great for fashion catalogs and lookbooks",
      before: "/placeholder.svg?height=600&width=800",
      after: "/placeholder.svg?height=600&width=800",
      category: "Fashion",
    },
  ];

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const previousExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            See It in Action
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover how our AI-powered background removal transforms images
            across different use cases.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExample}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <BeforeAfterSlider
                beforeImage={examples[currentExample].before}
                afterImage={examples[currentExample].after}
                alt={examples[currentExample].title}
              />

              <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {examples[currentExample].title}
                </h2>
                <p className="text-white/70 mb-4">
                  {examples[currentExample].description}
                </p>
                <div className="flex justify-center gap-2">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/70">
                    {examples[currentExample].category}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={previousExample}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextExample}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Example Thumbnails */}
        <div className="mt-12 flex justify-center gap-4">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentExample(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentExample === index ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
        {/* Call to action  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 text-white/70 backdrop-blur-sm text-sm mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Powered by advanced AI technology</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to remove backgrounds from your images?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust our AI-powered tool for
            their image editing needs.
          </p>

          <Link href="/remove-background#upload">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-black rounded-full px-8"
            >
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
