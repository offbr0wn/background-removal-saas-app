import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Stripe from "stripe";

export const SignedOutComponent = SignedOut as unknown as React.FC<{
  children: React.ReactNode;
}>;
export const SignedInComponent = SignedIn as unknown as React.FC<{
  children: React.ReactNode;
}>;

export const ClerkProviderComponent = ClerkProvider as unknown as React.FC<{
  children: React.ReactNode;
  afterSignOutUrl: string;
  signInForceRedirectUrl: string;
  signUpForceRedirectUrl: string;
}>;

export type RemoveBackgroundProps = {
  preview: string | null;
  fileName: string | null;
  assignUrlLink: string;
};

export type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

