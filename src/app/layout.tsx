import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ososo Translator",
  description:
    "A digital translator and dictionary for the Ososo language.",
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
