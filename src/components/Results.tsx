"use client";

import { useState } from "react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { FormulaDecomposition } from "@/components/FormulaDecomposition";
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
      className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent-muted)] hover:text-[var(--foreground)]"
    >
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

function FormulaBar({
  data,
  delayClass = "",
  minimal = false,
}: {
  data: AnalysisResult;
  delayClass?: string;
  minimal?: boolean;
}) {
  return (
    <div
      className={`animate-result ${delayClass} rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 sm:px-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            {data.categorie} · {data.celluleCible}
          </p>
          {!minimal && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {data.resume}
            </p>
          )}
          <pre
            className={`overflow-x-auto rounded-xl bg-[var(--formula-bg)] px-3 py-3 font-mono font-semibold leading-relaxed text-[var(--foreground)] ${
              minimal ? "mt-2 text-lg sm:text-xl" : "mt-3 text-base sm:text-lg"
            }`}
          >
            {data.formule}
          </pre>
        </div>
        <CopyButton text={data.formule} />
      </div>
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
  variant?: "default" | "logic" | "warning";
}) {
  const border =
    variant === "logic"
      ? "border-[var(--accent)]/18 bg-[var(--formula-bg)]/40"
      : variant === "warning"
        ? "border-[var(--warning)]/20 bg-[var(--warning-bg)]/15"
        : "border-[var(--border)] bg-[var(--card)]";

  return (
    <section
      className={`animate-result ${delayClass} rounded-2xl border ${border} px-4 py-5 sm:px-5`}
    >
      <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function LogicBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <ul className="space-y-4">
      {paragraphs.map((para, i) => (
        <li
          key={i}
          className="text-[15px] leading-relaxed text-[var(--foreground)] sm:text-base"
        >
          {para}
        </li>
      ))}
    </ul>
  );
}

function ExamErrors({ data }: { data: AnalysisResult }) {
  const items = [
    ...data.erreursFrequentes.map((e) => ({
      titre: e.titre,
      hint: e.description,
    })),
    ...data.conseilExamen.piegesClassiques.map((p) => ({
      titre: "À éviter",
      hint: p,
    })),
  ];

  if (items.length === 0) return null;

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="rounded-xl border border-[var(--border)]/80 bg-[var(--card)] px-4 py-3"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            {item.titre}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
            {item.hint}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Réponse rapide : formule + décomposition + confiance uniquement */
function QuickResults({ data }: { data: AnalysisResult }) {
  return (
    <FormulaDecomposition
      blocks={data.decompositionFormule}
      fullFormula={data.formule}
      delayClass="animate-result-delay-2"
      compact
      hideFullFormulaBanner
    />
  );
}

/** Explication complète */
function FullResults({ data }: { data: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <Section
        title="Comprendre la logique"
        variant="logic"
        delayClass="animate-result-delay-2"
      >
        <LogicBlock paragraphs={data.logiqueComprehension} />
      </Section>

      <Section title="Décomposition de la formule" delayClass="animate-result-delay-3">
        <FormulaDecomposition
          blocks={data.decompositionFormule}
          fullFormula={data.formule}
        />
      </Section>

      <Section title="Pourquoi cette structure" delayClass="animate-result-delay-4">
        <p className="text-[15px] leading-relaxed text-[var(--foreground)] sm:text-base">
          {data.pourquoiFormule}
        </p>
      </Section>

      <Section
        title="Erreurs fréquentes en examen"
        variant="warning"
        delayClass="animate-result-delay-5"
      >
        <ExamErrors data={data} />
      </Section>
    </div>
  );
}

function ContextBanner({ data }: { data: AnalysisResult }) {
  if (!data.contexteEnonce && !data.celluleUtilisateur) return null;

  return (
    <div className="animate-result rounded-xl border border-[var(--border)] bg-[var(--formula-bg)]/30 px-4 py-3">
      {data.contexteEnonce && (
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {data.contexteEnonce}
        </p>
      )}
      {data.celluleUtilisateur && (
        <p className="mt-2 text-xs text-[var(--accent)]">
          Cellule à remplir : {data.celluleCible}
        </p>
      )}
    </div>
  );
}

export function Results({ data, mode }: ResultsProps) {
  const isQuick = mode === "urgence";

  return (
    <div className="mt-8 space-y-4">
      <div
        className={`animate-result flex ${
          isQuick ? "justify-center" : "flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        }`}
      >
        {!isQuick && (
          <div>
            <p className="text-xs text-[var(--success)]">C&apos;est débloqué</p>
            <h3 className="mt-1 font-serif text-xl tracking-tight text-[var(--foreground)] sm:text-2xl">
              {data.titre}
            </h3>
          </div>
        )}
        <ConfidenceBadge
          level={data.confiance}
          className={isQuick ? "w-full justify-center" : "justify-start sm:ml-auto sm:justify-end"}
        />
      </div>

      {!isQuick && <ContextBanner data={data} />}

      <FormulaBar
        data={data}
        minimal={isQuick}
        delayClass="animate-result-delay-1"
      />

      {isQuick ? <QuickResults data={data} /> : <FullResults data={data} />}

      {isQuick && data.confiance === "low" && (
        <p className="text-center text-xs text-[var(--muted)]">
          Photo un peu floue — passez en explication complète avec votre énoncé.
        </p>
      )}
    </div>
  );
}
