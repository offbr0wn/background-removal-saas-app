import dayjs from "dayjs";
import { ClerkAddMetaData, ClerkFetchUser } from "./clerk-fetch-user";

import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;
export async function CreateStripeCheckout(lineItems: LineItem[]) {
  const { userId, user } = await ClerkFetchUser();

  if (!userId) {
    return { sessionId: null, sessionError: "User not found" };
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    customer_email: user?.email,
  });

  return { sessionId: session.id, sessionError: null };
}

export async function retrieveStripeSession(sessionId: string) {
  if (!sessionId) return { success: false, error: "Session ID not provided" };

  const { userId, privateMetadata } = await ClerkFetchUser();

  if (!userId) return { success: false, error: "User needs to sign in" };

  const previousCheckoutSessionIds = Array.isArray(
    privateMetadata?.checkout_session_ids
  )
    ? privateMetadata?.checkout_session_ids
    : [];

  if (previousCheckoutSessionIds.includes(sessionId)) {
    return {
      success: true,
      error: null,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  await ClerkAddMetaData({
    subscription_type: "Pro",
    api_call_count: 0,
    checkout_session_ids: [...previousCheckoutSessionIds, session.id],
    stripe_customer_id: session.customer,
    stripe_subscription_id:
      typeof session.subscription === "string"
        ? session?.subscription
        : session?.subscription?.id,
    stripe_current_period_end:
      typeof session.subscription === "string"
        ? undefined
        : session.subscription?.current_period_end,
  });

  return {
    success: true,
    error: null,
    sessionData: session,
  };
}

export async function cancelStripeSubscription() {
  const { userId, privateMetadata } = await ClerkFetchUser();
  const currentTimestampSeconds = Math.floor(Date.now() / 1000);

  if (!userId) return { success: false, error: "User needs to sign in" };

  if (!privateMetadata?.stripe_subscription_id) {
    return { success: false, error: "No active subscription" };
  }

  const subscription = await stripe.subscriptions.retrieve(
    privateMetadata?.stripe_subscription_id as string
  );
  if (subscription.status !== "canceled") {
    try {
      await stripe.subscriptions.cancel(
        privateMetadata.stripe_subscription_id as string
      );
      console.log("Subscription has been cancelled.");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      // Optionally, return an error here if cancellation is critical.
    }
  } else {
    alert("Subscription is already cancelled. You can continue using the service.");
  }

  if (
    (privateMetadata.stripe_current_period_end as number) >=
    currentTimestampSeconds
  ) {
    return {
      success: true,
      error: null,
      message: `Subscription is still active. User can continue using the service until the period ends. ${dayjs
        .unix(privateMetadata?.stripe_current_period_end as number)
        .format("dddd-D-MMMM-YYYY")}`,
    };
  } else {
    // Subscription period has ended.
    // Store the customer ID before updating metadata.
    const stripeCustomerId = privateMetadata?.stripe_customer_id;

    // Optionally delete the customer from Stripe first.
    if (stripeCustomerId) {
      try {
        await stripe.customers.del(stripeCustomerId as string);
        console.log("Customer account deleted from Stripe.");
      } catch (error) {
        console.error("Error deleting customer from Stripe:", error);
        // Optionally, you can return an error here if deletion is critical.
      }
    }

    // Update Clerk metadata to switch the user to the "Free" plan.
    await ClerkAddMetaData({
      subscription_type: "Free",
      api_call_count: 0,
      stripe_customer_id: null,
      checkout_session_ids: null,
      stripe_subscription_id: null,
      created_account_timestamp: null,
      stripe_current_period_end: null,
    });
    console.log("Metadata updated: User is now on the Free plan.");

    return {
      success: true,
      error: null,
      message: "Subscription expired. User has been downgraded to Free.",
    };
  }
}
