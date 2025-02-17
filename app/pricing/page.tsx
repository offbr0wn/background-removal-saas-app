"use client";

import { Layout } from "@/components/layout-page";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ClerkFetchUser } from "@/api/helpers/clerk-fetch-user";

export default function PricingPage() {
  const [currentTier, setCurrentTier] = useState<string>("Free");
  useEffect(() => {
    async function fetchTier() {
      const { privateMetadata } = await ClerkFetchUser();
      // Assume the subscription type is stored in privateMetadata.subscription_type
      const subscriptionType = privateMetadata?.subscription_type as string;
      setCurrentTier(subscriptionType);
    }
    fetchTier();
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for individuals and small projects",
      features: [
        { name: "20 images/month", included: true },
        { name: "Basic support", included: true },
        { name: "1080p max resolution", included: true },
        { name: "Standard processing speed", included: true },
        { name: "8K max resolution", included: false },
        { name: "4K max resolution", included: false },
        // { name: "API access", included: false },
        // { name: "Batch processing", included: false },
      ],
      cta: "Start Basic",
      //   highlighted: true,
    },
    {
      name: "Pro",
      price: "£10",
      description: "Ideal for professionals and growing businesses",
      features: [
        { name: "100 images/month", included: true },
        { name: "Priority support", included: true },
        { name: "4K max resolution", included: true },
        { name: "Faster processing speed", included: true },
        { name: "8K max resolution", included: false },
        // { name: "API access", included: true },
        // { name: "Batch processing", included: true },
      ],
      cta: "Go Pro",
      highlighted: true,
    },
    {
      name: "Expert",
      price: "Custom",
      description: "Tailored solutions for large-scale operations",
      features: [
        { name: "Unlimited images", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "8K max resolution", included: true },
        { name: "Fastest processing speed", included: true },
        // { name: "Advanced API features", included: true },
        // { name: "Custom integration", included: true },
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 text-center">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/70 mb-12 text-center max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans come with a 14-day
            free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 ">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
                scale: currentTier === plan?.price ? 1.05 : 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: currentTier === plan?.price ? 1.05 : 0.95,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                scale: currentTier === plan?.price ? 1.05 : 0.95,
              }}
              whileHover={{
                scale: 1.05,
                opacity: 1,
                y: -10,
                transition: { duration: 0.2 },
              }}
              className=" backdrop-blur-xl rounded-3xl p-8 flex flex-col bg-white/20 "
              id={plan.name}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-4xl font-bold text-white mb-2">{plan.price}</p>
              <p className="text-white/70 mb-6">{plan.description}</p>
              <ul className="mb-8 flex-grow space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-white"
                  >
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-white/50"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                // onClick={retrievePlan}
                disabled={currentTier === plan?.price}
              >
                {currentTier === plan?.price ? "Current Tier" : plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Not sure which plan is right for you?
          </h2>
          <p className="text-white/70 mb-8">
            Our team is here to help you choose the best option for your needs.
          </p>
          <Button size="lg" className="bg-white hover:bg-white/90 text-black">
            Talk to Sales
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
