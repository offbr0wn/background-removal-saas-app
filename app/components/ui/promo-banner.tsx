"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-red-600 to-rose-500 text-white"
        >
          <div className="container mx-auto py-3 px-10 flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <span className="text-4xl">🎉</span>
              <div>
                <p className="text-sm md:text-xl font-bold">Special offer for the first 100 users!</p>
                <p className="text-xs md:text-[15px] font-medium">Pro tier for just £2/month lifetime!</p>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <Link href="/pricing#pro" >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-red-600 px-4 py-2 rounded-full text-sm font-medium flex items-center cursor-pointer"
                >
                  Claim Offer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </Link>
              <button onClick={() => setIsVisible(false)} className="text-white hover:text-gray-200 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

