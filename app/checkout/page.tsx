"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Zap, Image, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { retrieveStripeSession } from "@/api/helpers/stripe-actions";
import dayjs from "dayjs";
import { ConfettiCanvas } from "@/components/ui/confetti-canvas";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SuccessPage() {
  const { session } = useClerk();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderNumber, setOrderNumber] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    // Generate a random order number
    if (!sessionId || !session) return;

    retrieveStripeSession(sessionId).then(({ success, error, sessionData }) => {
      if (success) {
        setSessionData(sessionData);
        console.log(sessionData);
        session?.reload();
      }

      if (error) {
        console.log(error);
      }
    });

    setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
  }, [session, sessionId]);

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06b6d4] via-[#3b82f6] to-[#1d4ed8] flex flex-col items-center justify-center p-4">
        <ConfettiCanvas />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06b6d4] via-[#3b82f6] to-[#1d4ed8] flex flex-col items-center justify-center p-4">
      <ConfettiCanvas />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center relative z-10"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>

        {/* Status Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-emerald-400 font-medium mb-4"
        >
          Payment successful
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Thanks for joining!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-white/70 mb-8"
        >
          We're super stoked to have you here!
        </motion.p>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 text-left"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-white/70">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="text-white">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="text-white">Pro Subscription</span>
            </div>
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span className="text-white">
                {dayjs
                  .unix(sessionData?.subscription?.current_period_start)
                  .format("MM/DD/YYYY")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Renewal Date:</span>
              <span className="text-white">
                {dayjs
                  .unix(sessionData?.subscription?.current_period_end)
                  .format("MM/DD/YYYY")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="text-white">£10/month</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Link href="/">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-black rounded-xl px-8 w-full sm:w-auto"
            >
              Start Removing Backgrounds
            </Button>
          </Link>
          {/* <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 w-full sm:w-auto dark"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
          </Button> */}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-2"
        >
          <p className="text-white/70">
            Check your email for your account details and next steps.
          </p>
          <Link
            href="/getting-started"
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Getting Started Guide
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
