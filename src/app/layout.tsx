import "./globals.css";
import type { Metadata } from "next";

const siteUrl = "https://ososo-translator-qtf8.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Ososo Translator | Ososo-English Dictionary",
    template: "%s | Ososo Translator",
  },

  description:
    "Translate Ososo words into English and explore the Ososo language dictionary, alphabet, and learning resources. Help preserve the Ososo language for future generations.",


  openGraph: {
    title: "Ososo Translator | Ososo-English Dictionary",
    description:
      "Explore the Ososo language, translate words into English, and help preserve Ososo for future generations.",
    url: siteUrl,
    siteName: "Ososo Translator",
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "UlTGapiSmFRdWNnKugY40uq3Lu_f6as0TD3eK8Avc_M",
  },
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
