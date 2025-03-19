const getPrice = (monthlyPrice: number) => {
  return {
    value: monthlyPrice,
    monthly: monthlyPrice,
    annual: monthlyPrice * 12,
    display: `$${monthlyPrice}`,
    perMonth: null,
    perYear: null,
    savings: null,
  };
};

export const ConstPlans = [
  {
    id: "basic",
    name: "Free",
    description: "Perfect for individuals with occasional needs",
    price: getPrice(0),
    features: [
      {
        name: "20 images/month",
        included: true,
        tooltip: "Process up to 50 images every month",
      },
      {
        name: "Basic support",
        included: true,
        tooltip: "Email support with 48-hour response time",
      },
      {
        name: "50% of input resolution",
        included: true,
        tooltip: "Output images at 720p resolution (1280×720 pixels)",
      },
      {
        name: "Standard processing speed",
        included: true,
        tooltip: "Process images in approximately 10 seconds each",
      },

      {
        name: "Batch processing",
        included: false,
        tooltip: "Process one image at a time",
      },
      {
        name: "Custom backgrounds",
        included: false,
        tooltip: "Basic transparent background only",
      },
    ],
    cta: "Start Free",
    popular: false,
    color: "blue",
    limitedOffer: false,
    bestFor: "Beginners",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for professionals and content creators",
    price: getPrice(2),
    features: [
      {
        name: "200 images/month",
        included: true,

        tooltip: "Process up to 1000 images every month",
      },
      {
        name: "Priority support",
        included: true,

        tooltip: "Priority email support with 24-hour response time",
      },
      {
        name: "Original output resolution",
        included: true,

        tooltip: "Output images at 4K resolution (3840×2160 pixels)",
      },
      {
        name: "2x faster processing",
        included: true,

        tooltip: "Process images in approximately 3 seconds each",
      },

      {
        name: "Batch processing",
        included: false,

        tooltip: "Process up to 100 images at once",
      },
      {
        name: "Custom backgrounds",
        included: false,

        tooltip: "Add custom colors or images as backgrounds",
      },
    ],
    cta: "Get Pro Now",
    popular: true,
    color: "purple",
    limitedOffer: false,
    bestFor: "Professionals",
  },
  {
    id: "business",
    name: "Business",
    description: "For teams and businesses with higher volume needs",
    price: getPrice(0),
    features: [
      {
        name: "1000+ images/month",
        included: true,
        tooltip: "Process up to 5000 images every month",
      },
      {
        name: "Dedicated support",
        included: true,
        tooltip: "Dedicated account manager and priority support",
      },
      {
        name: "4K max resolution",
        included: true,
        tooltip: "Output images at 8K resolution (7680×4320 pixels)",
      },
      {
        name: "4x faster processing",
        included: true,
        tooltip: "Process images in approximately 2 seconds each",
      },

      {
        name: "Bulk processing",
        included: true,
        tooltip: "Process unlimited images in bulk",
      },
      {
        name: "Custom integration",
        included: true,
        tooltip: "Custom integration support for your workflow",
      },
      {
        name: "Custom backgrounds",
        included: true,

        tooltip: "Add custom colors or images as backgrounds",
      },
    ],
    cta: "Contact Us",
    popular: null,
    color: "teal",
    limitedOffer: false,
    bestFor: "Teams",
  },
];

export const faqs = [
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