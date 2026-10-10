export const metadata: Metadata = {
  title: "Ososo Translator",
  description:
    "A digital translator and dictionary for the Ososo language.",
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
