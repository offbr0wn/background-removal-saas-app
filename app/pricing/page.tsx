"use client";

import { Layout } from "@/components/layout-page";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  MessageSquare,
  X,
  Zap,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingCardComponent } from "@/components/ui/pricing-tier-card";
import { ConstPlans } from "@/lib/const-data";
import Link from "next/link";

export default function PricingPage() {
  const { session } = useClerk();
  const [loading, setLoading] = useState(false);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<{
    subscriptionType: string;
    userId: string | null;
  }>({
    subscriptionType: "",
    userId: null,
  });
  useEffect(() => {
    async function fetchTier() {
      const { privateMetadata, userId } = await ClerkFetchUser();

      if (userId && !privateMetadata?.subscription_type) {
        router.push("/");
      }
      // Assume the subscription type is stored in privateMetadata.subscription_type
      const subscriptionType = privateMetadata?.subscription_type as string;

      setCurrentTier({ subscriptionType, userId });
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
      price: "£2 / month",
      description: "Ideal for professionals and growing businesses",
      features: [
        { name: "200 images/month", included: true },
        { name: "Priority support", included: true },
        { name: "Original output resolution", included: true },
        { name: "Faster processing speed", included: true },
        { name: "4K max resolution", included: true },
        { name: "Compression of images", included: false },
        { name: "Setting Background Color", included: false },
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
      ],
      cta: "Coming Soon",
    },
  ];

  const faqs = [
    {
      question: "What's the difference between Free and Pro plans?",
      answer:
        "The Basic plan is free and offers 20 images per month at 50% output resolution. The Pro plan gives you 200 images per month at 100% of output resolution. Pro users also get priority support and 2x faster processing speed.",
    },
    {
      question: "Can I upgrade from Free to Pro later?",
      answer:
        "You can upgrade from Basic to Pro at any time. Your account will be instantly upgraded with all Pro features as soon as your payment is processed.",
    },
    {
      question: "Is the Free plan free forever?",
      answer:
        "Yes, the Free plan is free forever. You can always upgrade to Pro, and you can always downgrade to Free if you change your mind.",
    },
    {
      question: "How does the image limit work?",
      answer:
        "The image limit resets every month on your billing date . Unused images don't roll over to the next month and usage is reset. Pro users get 200 images per month, which is perfect for most professional needs.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. You can do so by clicking the 'Cancel Subscription' button on your pricing page. You can continue using the service until the end of your current billing period.",
    },
    {
      question: "What happens if I don't renew my Pro subscription ?",
      answer:
        "If you don't renew your subscription, your account will  continue to function until the end of your current billing period. After that, you will be downgraded to the Free plan.",
    },
  ];

  const handlePlanClick = async (plan: any) => {
    console.log(plan);
    const { userId } = await ClerkFetchUser();

    if (plan === "Free") {
      if (!userId) {
        router.push("/sign-up");
      } else {
        toast({
          title: "Success",
          description:
            "You are already on the Paid plan. You can cancel your subscription to switch to the Free plan.",
          variant: "default",
        });
      }
    }

    if (plan === "Pro") {
      if (currentTier.subscriptionType === "Pro") {
        toast({
          title: "Already on Pro",
          description: "You do not need to upgrade to Pro.",
          variant: "default",
        });
        return;
      }
      setLoading(true);
      if (!userId) {
        router.push("/sign-up");
      } else {
        try {
          const stripe = await stripePromise;

          const lineItems = [
            {
              price: "price_1Qx8JZFhXFCC2y3QzA64blqm",

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
          if (!error) setLoading(false);
        } catch (error) {
          console.error("Error creating checkout session:", error);
        }
      }
    }

    if (plan === "Business") {
      toast({
        title: "Coming Soon",
        description: "This feature is coming soon!",
        variant: "default",
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { success, message } = await cancelStripeSubscription();
      if (success) {
        toast({
          title: "Your subscription has been canceled.",
          description: message,
        });

        session?.reload();
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
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb- max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            Choose the Perfect Plan for Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Image Editing
            </span>{" "}
            Needs
          </h1>
          <p className="text-xl text-white/80 mb-8 text-center max-w-2xl mx-auto">
            Select the perfect plan for your needs.
          </p>
        </motion.div>

        {/* Tier Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-8 mb-12 relative">
          {ConstPlans.map((plan, index) => (
            <PricingCardComponent
              key={plan.id}
              plan={plan}
              handleCancelSubscription={handleCancelSubscription}
              loading={loading}
              index={index}
              currentTier={currentTier}
              onSelect={() => handlePlanClick(plan.name)}
            />
          ))}
        </div>

        {/* Why Choose Pro Section */}
        <div className="mt-16 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Choose Our Pro Plan?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our Pro plan offers significant advantages over the Free plan,
              making it the perfect choice for growing teams and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                More Image Removals
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Get more image removals per month with our Pro plan.
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-1">Free Plan</p>
                  <p className="text-lg font-semibold text-white">
                    20 per month
                  </p>
                </div>
                <div className="w-8 h-px bg-white/20 mx-2"></div>
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-1">Pro Plan</p>
                  <p className="text-lg font-semibold text-blue-400">
                    200 per month
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Not Compression of Images
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Have the ability to remove images without compression and
                quality.
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-1">Free Plan</p>
                  <p className="text-lg font-semibold text-white">
                    50% of image output
                  </p>
                </div>
                <div className="w-8 h-px bg-white/20 mx-2"></div>
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-1">Pro Plan</p>
                  <p className="text-lg font-semibold text-purple-400">
                    100% of image output
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Priority Support
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Get faster response times and priority handling for all your
                support requests.
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-1">Free Plan</p>
                  <p className="text-lg font-semibold text-white">24 hours</p>
                </div>
                <div className="w-8 h-px bg-white/20 mx-2"></div>
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-1">Pro Plan</p>
                  <p className="text-lg font-semibold text-green-400">
                    4 hours
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature comparison table  */}
        <div className="mb-16 ">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Feature Comparison
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Compare key features across our plans to find the perfect fit for
              your needs.
            </p>
          </div>

          <div className="   overflow-x-auto  ">
            <table className="  w-full table-fixed border-collapse  ">
              {/* Table Header */}
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-800/50 rounded-tl-xl  ">
                    <span className="text-white/70 font-medium">Features</span>
                  </th>
                  <th className="p-4 bg-gray-800/50 ">
                    <div className="text-center">
                      <span className="text-white font-medium">Free</span>
                      <div className="text-white/50 text-xs mt-1">£0/month</div>
                    </div>
                  </th>
                  <th className="p-4 bg-gradient-to-b from-purple-900/50 to-blue-900/50 border-t-2 border-x-2 border-purple-500/30  ">
                    <div className="text-center relative">
                      <Badge className="absolute -top-5 z-100 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                        RECOMMENDED
                      </Badge>
                      <span className="text-white font-medium">Pro</span>
                      <div className="text-white/50 text-xs mt-1">£2/month</div>
                    </div>
                  </th>
                  <th className="p-4 bg-gray-800/50 rounded-tr-xl ">
                    <div className="text-center">
                      <span className="text-white font-medium">Enterprise</span>
                      <div className="text-white/50 text-xs mt-1">
                        Custom pricing
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-gray-900/70">
                {/* Core Features */}
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/70">Monthly images</td>
                  <td className="p-4 text-center text-white/70">20</td>
                  <td className="p-4 text-center text-white bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-x-2 border-purple-500/30">
                    <span className="font-medium">200</span>
                  </td>
                  <td className="p-4 text-center text-white/70">1000+</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/70">Max resolution</td>
                  <td className="p-4 text-center text-white/70">50%</td>
                  <td className="p-4 text-center text-white bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-x-2 border-purple-500/30">
                    <span className="font-medium">100%</span>
                  </td>
                  <td className="p-4 text-center text-white/70">200%</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/70">Processing speed</td>
                  <td className="p-4 text-center text-white/70">Standard</td>
                  <td className="p-4 text-center text-white bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-x-2 border-purple-500/30">
                    <span className="font-medium">2x faster</span>
                  </td>
                  <td className="p-4 text-center text-white/70">5x faster</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/70">Batch processing</td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-red-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-gradient-to-b from-purple-900/40 to-blue-900/40 border-x-2 border-purple-500/30">
                    <div className="h-5 w-5 rounded-full  flex items-center justify-center mx-auto">
                      <X className="h-5 w-5 text-red-400 mx-auto" />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/70">Custom backgrounds</td>
                  <td className="p-4 text-center">
                    <X className="h-5 w-5 text-red-400 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-x-2 border-purple-500/30">
                    <div className="h-5 w-5 rounded-full  flex items-center justify-center mx-auto">
                      <X className="h-5 w-5 text-red-400 mx-auto" />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/70">Support response</td>
                  <td className="p-4 text-center text-white/70">24 hours</td>
                  <td className="p-4 text-center text-white bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-x-2 border-purple-500/30">
                    <span className="font-medium">4 hours</span>
                  </td>
                  <td className="p-4 text-center text-white/70">1 hour</td>
                </tr>

                {/* CTA Row */}
                <tr className="hidden md:table-row">
                  <td className="p-4 bg-gray-800/50 rounded-bl-xl"></td>
                  <td className="p-4 bg-gray-800/50 text-center">
                    <Button
                      className="bg-white hover:bg-white/90 text-black"
                      onClick={() => handlePlanClick("Free")}
                    >
                      Get Started
                    </Button>
                  </td>
                  <td className="p-4 bg-gradient-to-b from-purple-900/50 to-blue-900/50 text-center border-b-2 border-x-2 border-purple-500/30 rounded-b-xl">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white relative overflow-hidden"
                      onClick={() => handlePlanClick("Pro")}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        // variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        style={{ backgroundSize: "200% 100%" }}
                      />
                      <span className="relative z-10 flex items-center">
                        Upgrade to Pro
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </Button>
                  </td>
                  <td className="p-4 bg-gray-800/50 text-center rounded-br-xl">
                    <Button className="bg-white/10 hover:bg-white/20 text-white">
                      <Link href="/contact"> Contact Sales</Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ's section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-sm">
              Have questions? We've got answers. If you can't find what you're
              looking for, feel free to contact our support team.
            </p>
          </div>

          <div className="max-w-full mx-auto bg-gray-900/70 rounded-xl p-4 border border-white/10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="text-white hover:text-white text-lg py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 text-md">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-xl overflow-hidden relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NHgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="relative p-8 md:p-10 flex flex-col items-center text-center">
            <Badge className="mb-4 px-3 py-1 border-white/20 text-white/90 bg-gray-900/50">
              Limited Time Offer
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-white/80 max-w-xl mb-6 text-sm">
              Join thousands of professionals who trust our Pro plan for their
              background removal needs. Upgrade today and experience the
              difference with our limited offer of £2 / month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white relative overflow-hidden"
                onClick={() => handlePlanClick("Pro")}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial="hidden"
                  animate="visible"
                />
                <span className="relative z-10 flex items-center">
                  Start Your Pro Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
              {!currentTier?.userId && (
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10 dark"
                  onClick={() => handlePlanClick("Free")}
                >
                  Try Basic for Free
                </Button>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-4 flex-wrap">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-white/80 text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-white/80 text-xs">Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-white/80 text-xs">30-day money-back</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="text-center mb-4">
            <p className="text-white/70 text-sm">
              Secure payment processing by Stripe
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg">
              <CreditCard className="h-4 w-4 text-white mr-1" />
              <span className="text-white text-xs">
                All Major Credit Cards Accepted
              </span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg">
              <svg
                className="h-4 w-4 text-white mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
              </svg>
              <span className="text-white text-xs">Secure Stripe Payments</span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg">
              <svg
                className="h-4 w-4 text-white mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.5 0h-9.67A4.17 4.17 0 0 0 3.67 4.17v15.66A4.17 4.17 0 0 0 7.83 24h9.67A4.17 4.17 0 0 0 21.67 19.83V4.17A4.17 0 0 0 17.5 0z" />
                <path
                  fill="#ffffff"
                  d="M8.92 17.5h2.5v-2.5h-2.5v2.5zm0-5h2.5V7.5h-2.5v5zm3.33 5h2.5v-2.5h-2.5v2.5zm0-5h2.5V7.5h-2.5v5z"
                />
              </svg>
              <span className="text-white text-xs">GDPR Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Live Chat CTA */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center bg-gray-800 px-4 py-2 rounded-full border border-white/10">
            <MessageSquare className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-white text-sm">
              Have questions?{" "}
              <Button
                variant="link"
                className="text-purple-400 p-0 h-auto text-sm"
                asChild
              >
                <Link href="/contact">Chat with our team</Link>
              </Button>
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
