import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

export const SignedOutComponent = SignedOut as unknown as React.FC<{
  children: React.ReactNode;
}>;
export const SignedInComponent = SignedIn as unknown as React.FC<{
  children: React.ReactNode;
}>;

export const ClerkProviderComponent = ClerkProvider as unknown as React.FC<{
  children: React.ReactNode;
  publishableKey: string | undefined;
}>;
