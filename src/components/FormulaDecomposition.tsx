"use client";

import type { FormulaBlock } from "@/lib/types";

interface FormulaDecompositionProps {
  blocks: FormulaBlock[];
  fullFormula: string;
  delayClass?: string;
  compact?: boolean;
  /** Mode rapide : la formule est déjà au-dessus */
  hideFullFormulaBanner?: boolean;
}

const BLOCK_COLORS = [
  "formula-block-0",
  "formula-block-1",
  "formula-block-2",
  "formula-block-3",
  "formula-block-4",
] as const;

export function FormulaDecomposition({
  blocks,
  fullFormula,
  delayClass = "",
  compact = false,
  hideFullFormulaBanner = false,
}: FormulaDecompositionProps) {
  const meaningful = blocks.filter(
    (b) => b.role !== "Séparateur" && b.role !== "Fin" && b.expression.trim() !== "; ",
  );

  return (
    <div className={`animate-result ${delayClass} space-y-4`}>
      {!hideFullFormulaBanner && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--formula-bg)] px-4 py-3.5 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Toute la formule
          </p>
          <pre className="mt-2 overflow-x-auto font-mono text-sm font-semibold leading-relaxed text-[var(--foreground)] sm:text-base">
            {fullFormula}
          </pre>
        </div>
      )}

      {/* Blocs colorés */}
      <div
        className={`flex flex-wrap items-baseline gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 ${
          compact ? "" : ""
        }`}
        aria-label="Formule décomposée en blocs"
      >
        {blocks.map((block, i) => {
          const color =
            BLOCK_COLORS[block.colorIndex % BLOCK_COLORS.length] ??
            BLOCK_COLORS[0];
          const isSeparator =
            block.role === "Séparateur" || block.expression.trim() === "; ";

          if (isSeparator) {
            return (
              <span
                key={i}
                className="font-mono text-sm text-[var(--muted)]"
              >
                {block.expression}
              </span>
            );
          }

          return (
            <span
              key={i}
              className={`inline-flex items-center rounded-lg border px-2 py-1 font-mono text-xs font-semibold sm:text-sm ${color}`}
              title={block.explanation}
            >
              {block.expression}
            </span>
          );
        })}
      </div>

      {/* Explications par bloc */}
      <ul className={`space-y-3 ${compact ? "space-y-2" : ""}`}>
        {meaningful.map((block, i) => {
          const color =
            BLOCK_COLORS[block.colorIndex % BLOCK_COLORS.length] ??
            BLOCK_COLORS[0];
          return (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-[var(--border)]/80 bg-[var(--card)] p-3.5 sm:p-4"
            >
              <span
                className={`shrink-0 self-start rounded-lg border px-2 py-1 font-mono text-[11px] font-semibold leading-none ${color}`}
              >
                {block.role ?? block.expression.slice(0, 12)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mt-0.5 text-sm leading-relaxed text-[var(--foreground)]">
                  {block.explanation}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
