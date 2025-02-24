import dayjs from "dayjs";
import { ClerkAddMetaData, ClerkFetchUser } from "./clerk-fetch-user";


import { LineItem } from "@/middleware/clerk-component-type";


export async function CreateStripeCheckout(lineItems: LineItem[]) {
  const { userId, user } = await ClerkFetchUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create-stripe-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lineItems, user, userId }),
    }
  );

  const data = await response.json();
  return data;
}

export async function retrieveStripeSession(sessionId: string) {
  const { userId, privateMetadata } = await ClerkFetchUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/retrieve-stripe-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, userId, privateMetadata }),
    }
  );

  const data = await response.json();

  return data;
}

export async function cancelStripeSubscription() {
  const { userId, privateMetadata } = await ClerkFetchUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cancel-stripe-subscription`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, privateMetadata }),
    }
  );

  const data = await response.json();
  return data;
}
