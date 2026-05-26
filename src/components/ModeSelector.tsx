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
  icon: React.ReactNode;
}[] = [
  {
    id: "urgence",
    label: "Réponse rapide",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "apprentissage",
    label: "Explication complète",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
      </svg>
    ),
  },
];

export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  return (
    <div
      className="mode-segment mx-auto max-w-sm"
      role="radiogroup"
      aria-label="Réponse rapide ou explication complète"
    >
      <span
        aria-hidden
        className="mode-segment-indicator"
        data-position={mode === "apprentissage" ? "right" : "left"}
      />

      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active ? "true" : "false"}
            disabled={disabled}
            onClick={() => onChange(m.id)}
            className="mode-segment-option"
          >
            {m.icon}
            <span className="whitespace-nowrap">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
