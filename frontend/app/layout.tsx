import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS Listing Migration PoC",
  description: "AWS-ready real estate listing submission proof of concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
