"use client";

import type { AnalysisMode } from "@/lib/types";

interface ModeSelectorProps {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
  disabled?: boolean;
}

const MODES: {
  id: AnalysisMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "urgence",
    label: "Urgence",
    description: "Formule + l'essentiel",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "apprentissage",
    label: "Apprentissage",
    description: "Guide complet",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  return (
    <div className="w-full">
      <p className="mb-2.5 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
        Mode
      </p>
      <div
        className="relative grid grid-cols-2 gap-1 rounded-2xl border border-[var(--border)] bg-[var(--formula-bg)]/60 p-1"
        role="radiogroup"
        aria-label="Choisir le mode d'affichage"
      >
        {MODES.map((m) => {
          const selected = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(m.id)}
              className={`
                relative flex flex-col items-center gap-1.5 rounded-xl px-3 py-3.5 text-center transition-all duration-200
                sm:flex-row sm:justify-center sm:gap-2.5 sm:px-4
                ${selected
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm ring-1 ring-[var(--border)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"}
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              `}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  selected ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--card)]"
                }`}
              >
                {m.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold">{m.label}</span>
                <span className="mt-0.5 block text-[10px] font-normal opacity-80 sm:text-xs">
                  {m.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
