import type { ConfidenceLevel } from "@/lib/types";

export const CONFIDENCE_META: Record<
  ConfidenceLevel,
  {
    label: string;
    description: string;
    dotClass: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  high: {
    label: "Formule très probable",
    description: "L'exercice correspond clairement à ce type de formule.",
    dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    bgClass: "bg-emerald-500/8",
    textClass: "text-emerald-700 dark:text-emerald-400",
    borderClass: "border-emerald-500/25",
  },
  medium: {
    label: "Exercice ambigu",
    description: "Plusieurs interprétations possibles — vérifiez la formule.",
    dotClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.45)]",
    bgClass: "bg-amber-500/8",
    textClass: "text-amber-700 dark:text-amber-400",
    borderClass: "border-amber-500/25",
  },
  low: {
    label: "Image peu lisible",
    description: "Qualité insuffisante — résultat à confirmer manuellement.",
    dotClass: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.45)]",
    bgClass: "bg-red-500/8",
    textClass: "text-red-700 dark:text-red-400",
    borderClass: "border-red-500/25",
  },
};

export function pickRandomConfidence(): ConfidenceLevel {
  const r = Math.random();
  if (r < 0.55) return "high";
  if (r < 0.85) return "medium";
  return "low";
}
