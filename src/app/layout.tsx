import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXCEN — Comprendre la logique Excel",
  description:
    "Décomposez les formules Excel (INDEX, EQUIV, RECHERCHEV, SI…) et visualisez le raisonnement dans le contexte de votre tableau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
