import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Suspense>
  );
}
