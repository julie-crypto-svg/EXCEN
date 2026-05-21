import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXCEN — Exercices Excel",
  description:
    "Uploadez une capture d'exercice Excel et obtenez la formule et la méthode.",
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
