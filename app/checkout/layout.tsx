import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Suspense fallback={<LoadingSpinner />}>
        <body>{children}</body>
      </Suspense>
    </html>
  );
}
