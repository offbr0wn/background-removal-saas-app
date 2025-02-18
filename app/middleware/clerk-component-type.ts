import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

export const SignedOutComponent = SignedOut as unknown as React.FC<{
  children: React.ReactNode;
}>;
export const SignedInComponent = SignedIn as unknown as React.FC<{
  children: React.ReactNode;
}>;

export const ClerkProviderComponent = ClerkProvider as unknown as React.FC<{
  children: React.ReactNode;
  afterSignOutUrl: string;
}>;

export type RemoveBackgroundProps = {
  preview: string | null;
  fileName: string | null;
  assignUrlLink: string;
};
