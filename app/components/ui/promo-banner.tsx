"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-red-600/90 to-orange-600 text-white "
        >
          <div className="container mx-auto py-2 px-10 flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-white" />
              <p className="font-bold text-md">
                <span className="hidden md:inline  bg-white/20 hover:bg-white/20 border-white/10 text-white text-sm font-bold py-2 px-4 rounded-full ">
                  Limited Time Offer:
                </span>{" "}
                First 100 users get Pro tier for just $4/month lifetime!
              </p>
            </div>
            <div className="flex items-center space-x-5">
              <Link href="/pricing#pro">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 hover:bg-white/20 border-white/10 text-white text-sm font-bold py-2 px-4 rounded-full w-full cursor-pointer"
                >
                  Claim Offer
                </motion.button>
              </Link>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
