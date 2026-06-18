import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICS Eagle Rays Swim Team",
  description: "International Community School Bangkok — Eagle Rays Swim Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
