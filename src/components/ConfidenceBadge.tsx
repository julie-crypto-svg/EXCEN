import { CONFIDENCE_META } from "@/lib/confidence";
import type { ConfidenceLevel } from "@/lib/types";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceBadge({ level, className = "" }: ConfidenceBadgeProps) {
  const meta = CONFIDENCE_META[level];

  return (
    <div
      className={`inline-flex max-w-full items-center gap-2.5 rounded-full border px-3.5 py-2 ${meta.borderClass} ${meta.bgClass} ${className}`}
      role="status"
      aria-label={`Niveau de confiance : ${meta.label}`}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dotClass}`}
        aria-hidden
      />
      <p className={`text-xs font-semibold leading-tight ${meta.textClass}`}>
        {meta.label}
      </p>
    </div>
  );
}
