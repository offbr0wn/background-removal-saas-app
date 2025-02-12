"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      description: "Perfect for individuals and small projects",
      features: [
        { name: "100 images/month", included: true },
        { name: "Basic support", included: true },
        { name: "720p max resolution", included: true },
        { name: "Standard processing speed", included: true },
        { name: "API access", included: false },
        // { name: "Batch processing", included: false },
      ],
      cta: "Start Basic",
    },
    {
      name: "Pro",
      price: "$29",
      description: "Ideal for professionals and growing businesses",
      features: [
        { name: "1000 images/month", included: true },
        { name: "Priority support", included: true },
        { name: "4K max resolution", included: true },
        { name: "Faster processing speed", included: true },
        { name: "API access", included: true },
        { name: "Batch processing", included: true },
      ],
      cta: "Go Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large-scale operations",
      features: [
        { name: "Unlimited images", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "8K max resolution", included: true },
        { name: "Fastest processing speed", included: true },
        { name: "Advanced API features", included: true },
        { name: "Custom integration", included: true },
      ],
      cta: "Contact Sales",
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-bold text-white mb-4 text-center">Choose Your Plan</h1>
          <p className="text-xl text-white/70 mb-12 text-center max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans come with a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 flex flex-col ${
                plan.highlighted ? "ring-2 ring-blue-500 bg-white/20" : ""
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold text-white mb-2">{plan.price}</p>
              <p className="text-white/70 mb-6">{plan.description}</p>
              <ul className="mb-8 flex-grow space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-white">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-white/50"}>{feature.name}</span>
                  </li>
                ))}
              </ul>
              <Link href="/remove-background#upload">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Not sure which plan is right for you?</h2>
          <p className="text-white/70 mb-8">Our team is here to help you choose the best option for your needs.</p>
          <Button size="lg" className="bg-white hover:bg-white/90 text-black">
            Talk to Sales
          </Button>
        </motion.div>
      </div>
    </Layout>
  )
}

