import Script from "next/script";
import React from "react";

export default function AdSense({ pId }: { pId: string }) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
