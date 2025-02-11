import type { Metadata } from 'next'
import "./globals.css";


export const metadata: Metadata = {
  title: "RemoveBG - AI Background Removal",
  description: "Remove backgrounds from images instantly with AI precision",
}


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
