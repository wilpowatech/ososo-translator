import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ososo-English Dictionary",
  description:
    "Search the Ososo-English dictionary to discover Ososo words, English meanings, categories, and pronunciation information.",
};

export default function DictionaryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
