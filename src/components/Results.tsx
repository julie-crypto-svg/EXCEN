"use client";

import { useState } from "react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import type { AnalysisMode, AnalysisResult } from "@/lib/types";

interface ResultsProps {
  data: AnalysisResult;
  mode: AnalysisMode;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
    >
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

function FormulaBar({
  data,
  large = false,
  delayClass = "",
}: {
  data: AnalysisResult;
  large?: boolean;
  delayClass?: string;
}) {
  return (
    <div
      className={`animate-result ${delayClass} flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 sm:px-5`}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
          {data.categorie} · cellule {data.celluleCible}
        </p>
        <pre
          className={`mt-1 overflow-x-auto font-mono font-semibold text-[var(--foreground)] ${
            large ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          {data.formule}
        </pre>
      </div>
      <CopyButton text={data.formule} />
    </div>
  );
}

function Section({
  title,
  children,
  delayClass = "",
  variant = "default",
}: {
  title: string;
  children: React.ReactNode;
  delayClass?: string;
  variant?: "default" | "warning";
}) {
  const border =
    variant === "warning"
      ? "border-[var(--warning)]/25 bg-[var(--warning-bg)]/20"
      : "border-[var(--border)] bg-[var(--card)]";

  return (
    <section
      className={`animate-result ${delayClass} rounded-2xl border ${border} px-4 py-4 sm:px-5 sm:py-5`}
    >
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function mergePieges(data: AnalysisResult): { titre: string; hint: string }[] {
  const fromErrors = data.erreursFrequentes.map((e) => ({
    titre: e.titre,
    hint: e.description,
  }));
  const fromExam = data.conseilExamen.piegesClassiques.map((p) => ({
    titre: "En contrôle",
    hint: p,
  }));
  return [...fromErrors, ...fromExam].slice(0, 5);
}

function UrgenceResults({ data }: { data: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <FormulaBar data={data} large delayClass="animate-result-delay-1" />
      <p className="animate-result animate-result-delay-2 px-1 text-center text-sm leading-snug text-[var(--foreground)] sm:text-base">
        {data.explicationCourte}
      </p>
      {data.confiance === "low" && (
        <p className="animate-result animate-result-delay-3 text-center text-xs text-[var(--muted)]">
          Image floue — vérifiez avec votre énoncé.
        </p>
      )}
    </div>
  );
}

function ApprentissageResults({ data }: { data: AnalysisResult }) {
  const pieges = mergePieges(data);

  return (
    <div className="space-y-4">
      <FormulaBar data={data} delayClass="animate-result-delay-1" />

      <Section title="Pourquoi cette formule" delayClass="animate-result-delay-2">
        <p className="text-sm leading-snug text-[var(--foreground)]">
          {data.pourquoiFormule}
        </p>
      </Section>

      <Section title="Méthode étape par étape" delayClass="animate-result-delay-3">
        <ol className="space-y-2.5">
          {data.etapes.map((etape, i) => (
            <li key={i} className="flex gap-3 text-sm leading-snug">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[11px] font-bold text-[var(--background)]">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[var(--foreground)]">{etape}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Pièges fréquents"
        variant="warning"
        delayClass="animate-result-delay-4"
      >
        <ul className="space-y-2.5">
          {pieges.map((p, i) => (
            <li
              key={i}
              className="rounded-lg border border-[var(--border)]/80 bg-[var(--card)] px-3 py-2.5"
            >
              <p className="text-sm font-medium text-[var(--foreground)]">
                {p.titre}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-[var(--muted)]">
                {p.hint}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function ContextBanner({ data }: { data: AnalysisResult }) {
  if (!data.contexteEnonce && !data.celluleUtilisateur) return null;

  return (
    <div className="animate-result animate-result-delay-1 rounded-xl border border-[var(--border)] bg-[var(--formula-bg)]/40 px-4 py-3">
      {data.contexteEnonce && (
        <p className="text-xs leading-snug text-[var(--muted)]">
          {data.contexteEnonce}
        </p>
      )}
      {data.celluleUtilisateur && (
        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]">
          Cellule indiquée : {data.celluleCible}
        </p>
      )}
    </div>
  );
}

export function Results({ data, mode }: ResultsProps) {
  const isUrgence = mode === "urgence";

  return (
    <div className="mt-8 space-y-4">
      <div className="animate-result flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-xs font-medium text-[var(--success)] sm:text-left">
          ✓ Prêt
        </p>
        <ConfidenceBadge level={data.confiance} className="justify-center sm:ml-auto" />
      </div>

      <ContextBanner data={data} />

      {isUrgence ? (
        <UrgenceResults data={data} />
      ) : (
        <ApprentissageResults data={data} />
      )}
    </div>
  );
}
