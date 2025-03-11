import Script from "next/script";
import React from "react";

export default function AdSense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3025338220182456"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
