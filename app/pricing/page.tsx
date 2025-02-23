"use client";

import { Layout } from "@/components/layout-page";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  ClerkAddMetaData,
  ClerkFetchUser,
} from "@/api/helpers/clerk-fetch-user";
import {
  cancelStripeSubscription,
  CreateStripeCheckout,
} from "@/api/helpers/stripe-actions";
import { toast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { session } = useClerk();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<string>("Free");
  useEffect(() => {
    async function fetchTier() {
      const { privateMetadata, userId } = await ClerkFetchUser();

      if (userId && !privateMetadata?.subscription_type) {
        router.push("/");
      }
      // Assume the subscription type is stored in privateMetadata.subscription_type
      const subscriptionType = privateMetadata?.subscription_type as string;

      setCurrentTier(subscriptionType);
    }
    fetchTier();
  }, []);

  const plans = [
    {
      name: "Free",
      price: "£0",
      description: "Perfect for individuals and small projects",
      features: [
        { name: "20 images/month", included: true },
        { name: "Basic support", included: true },
        { name: "50% of input resolution", included: true },
        { name: "Standard processing speed", included: true },
        { name: "4K max resolution", included: false },
        { name: "Compression of images", included: true },
        // { name: "API access", included: false },
        // { name: "Batch processing", included: false },
      ],
      cta: "Start Basic",
      // highlighted: true,
    },
    {
      name: "Pro",
      price: "£10 / month",
      description: "Ideal for professionals and growing businesses",
      features: [
        { name: "150 images/month", included: true },
        { name: "Priority support", included: true },
        { name: "Original output resolution", included: true },
        { name: "Faster processing speed", included: true },
        { name: "4K max resolution", included: true },
        { name: "Compression of images", included: false },
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
        { name: "Setting Background Color", included: true },
        // { name: "Advanced API features", included: true },
        // { name: "Custom integration", included: true },
      ],
      cta: "Coming Soon",
    },
  ];

  const handlePlanClick = async (e: any) => {
    const { userId } = await ClerkFetchUser();
    if (e.target.name === "Free") {
      if (!userId) {
        router.push("/sign-up");
      }

      // await ClerkAddMetaData({
      //   subscription_type: "Free",
      //   api_call_count: 0,
      // });
    }

    if (e.target.name === "Pro") {
      try {
        const stripe = await stripePromise;

        const lineItems = [
          {
            price: "price_1Quut1FhXFCC2y3Q0W3qduLP",
            quantity: 1,
          },
        ];

        const { sessionId, sessionError } = await CreateStripeCheckout(
          lineItems
        );

        if (!sessionId || sessionError) {
          toast({
            title: "Error",
            description: sessionError,
            variant: "destructive",
          });
          throw new Error("Failed to create checkout session");
        }
        // Replace this with your logic to handle plan selection

        if (!stripe) {
          throw new Error("Stripe is not initialized");
        }
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          throw new Error("Failed to redirect to checkout");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    }

    if (e.target.name === "Expert") {
      toast({
        title: "Coming Soon",
        description: "This feature is coming soon!",
        variant: "default",        
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { success, error, message } = await cancelStripeSubscription();
      if (success) {
        toast({
          title: "Success",
          description: message,
        });

        session?.reload();
        // router.push("/");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };
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
            Select the perfect plan for your needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 ">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
                scale: currentTier === plan?.name ? 1.05 : 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: currentTier === plan?.name ? 1.05 : 0.95,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                scale: currentTier === plan?.name ? 1.05 : 0.95,
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
                className={`w-full mb-4 ${
                  plan.highlighted
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                name={plan.name}
                onClick={
                  currentTier === plan?.name
                    ? undefined
                    : (e) => handlePlanClick(e)
                }
                disabled={currentTier === plan?.name}
              >
                {currentTier === plan?.name ? "Current Tier" : plan.cta}
              </Button>
              {currentTier === "Pro" && plan.name === "Pro" && (
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-red-500 hover:bg-white/20 text-white"
                      : "bg-red-500/50 hover:bg-white/20 text-white"
                  }`}
                  name={plan.name}
                  onClick={handleCancelSubscription}
                >
                  {currentTier === plan?.name
                    ? "Cancel Subscription"
                    : plan.cta}
                </Button>
              )}
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
