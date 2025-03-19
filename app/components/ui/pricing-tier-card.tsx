"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Check, X, ChevronRight, Sparkles } from "lucide-react";
import { LoadingSpinner } from "./loading-spinner";

interface Feature {
  name: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

interface PlanPrice {
  value: number;
  monthly: number;
  annual: number;
  display: string;
  perMonth: string | null;
  perYear: string | null;
  savings: string | null;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: PlanPrice;
  features: Feature[];
  cta: string;
  popular?: boolean | null;
  color: string;
  limitedOffer?: boolean;
  offerText?: string;
  bestFor?: string;
}

interface PricingCardProps {
  plan: Plan;
  onSelect?: () => void;
  loading?: boolean;
  index?: number;
  currentTier: { subscriptionType: string; userId: string | null };
  handleCancelSubscription?: () => void;
}

const shimmer = {
  hidden: { backgroundPosition: "-100% 0" },
  visible: {
    backgroundPosition: ["200% 0", "-100% 0"],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 2.5,
      ease: "linear",
    },
  },
};
export function PricingCardComponent({
  plan,
  onSelect,
  currentTier,
  handleCancelSubscription,
  loading,
  index,
}: PricingCardProps) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden ${
        plan.popular ? "md:scale-105 z-10" : ""
      }`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={plan.popular ? { scale: 1.05 } : {}}
      animate={
        plan.popular
          ? {
              scale: [1.02, 1.03, 1],
              transition: {
                duration: 2,
                repeat: 5,
                repeatType: "reverse",
              },
            }
          : {}
      }
    >
      <div
        className={`h-full flex flex-col border bg-gray-900/80 ${
          plan.popular
            ? "border-2 border-blue-400/50 shadow-lg shadow-blue-500/20 backdrop-blur-sm"
            : "border-white/10"
        } 
            `}
      >
        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-1 right-0">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold px-3 py-1 rounded-bl-lg text-white shadow-lg transform rotate-0 origin-top-right">
              MOST POPULAR
            </div>
          </div>
        )}

        {/* Card Header */}
        <div className="relative pt-6 px-4">
          {/* Best For Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                  : "bg-gray-800 text-white/70"
              }`}
            >
              {plan.bestFor}
            </div>
          </div>

          {/* Plan Name and Description */}
          <div className="mt-6 mb-2">
            <div className="flex items-center">
              <h3 className={`text-4xl font-bold text-white`}>{plan.name}</h3>
            </div>
            <p className="text-white/70 mt-1 text-xs">{plan.description}</p>
          </div>

          {/* Limited Time Offer */}
          {plan.limitedOffer && (
            <div className="mt-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 px-2 py-1 rounded-md text-xs font-medium inline-flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                {plan.offerText}
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="flex items-baseline">
              {plan.id === "business" ? (
                <span className="text-white text-2xl font-bold ">
                  Coming soon
                </span>
              ) : (
                <>
                  <span
                    className={`text-4xl font-bold ${
                      plan.popular
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
                        : "text-white"
                    }`}
                  >
                    {plan.price.display}
                  </span>
                  <span className="text-white/70 ml-1 text-xs">/mo</span>
                </>
              )}
            </div>
          </div>

          <div className="relative flex justify-center pb-2 flex-col">
            {/* Plan Selection Button */}
            {(currentTier?.subscriptionType !== plan?.name &&
              loading &&
              index) === 1 ? (
              <LoadingSpinner className="self-center" />
            ) : (
              <Button
                className={`w-full mb-3 text-white relative overflow-hidden shadow-md ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    : "bg-white hover:bg-white/90 text-black"
                }`}
                onClick={onSelect}
                disabled={currentTier?.subscriptionType === plan?.name}
              >
                {plan.popular &&
                  currentTier?.subscriptionType !== plan?.name && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  )}
                <span className="relative z-10 flex items-center font-medium">
                  {currentTier?.subscriptionType === plan?.name
                    ? "Current Tier"
                    : plan.cta}
                  {currentTier?.subscriptionType !== plan?.name && (
                    <ChevronRight className="ml-1 h-4 w-4" />
                  )}
                </span>
              </Button>
            )}

            {currentTier?.subscriptionType === "Pro" && plan.name === "Pro" && (
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-red-500 hover:bg-white/20 text-white"
                    : "bg-red-500/50 hover:bg-white/20 text-white"
                }`}
                name={plan.name}
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 pb-3 flex-grow">
          <div
            className={`h-px w-full ${
              plan.popular
                ? "bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20"
                : "bg-white/10"
            } mb-3`}
          ></div>
          <p className="text-sm font-medium text-white/80 mb-2">
            What's included:
          </p>

          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div className="flex items-start" key={index}>
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center mt-0.5 mr-1.5 flex-shrink-0 ${
                    feature.included
                      ? plan.popular
                        ? "bg-gradient-to-r from-blue-400 to-purple-400"
                        : "bg-green-500/20"
                      : ""
                  }`}
                >
                  {feature.included ? (
                    <Check className="h-2.5 w-2.5 text-white" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-red-400" />
                  )}
                </div>
                <span
                  className={`text-md ${
                    feature.included
                      ? "text-white font-medium"
                      : "text-white/50"
                  }`}
                >
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        {plan.popular && (
          <div className="mt-auto">
            <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 p-4 text-center border-t border-blue-400/30">
              <div className="flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-blue-200 mr-2" />
                <span className="text-blue-100 text-xs">Cancel anytime</span>
              </div>
            </div>
          </div>
        )}
        {!plan.popular && plan.id === "basic" && (
          <div className="mt-auto">
            <div className="bg-gray-800 p-2 text-center">
              <p className="text-white/70 text-xs">No credit card required</p>
            </div>
          </div>
        )}
        {plan.popular === null && (
          <div className="mt-auto">
            <div className="bg-gray-800 p-2 text-center">
              <p className="text-white/70 text-xs">Contact Us</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
