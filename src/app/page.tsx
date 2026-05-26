"use client";

import { useState } from "react";
import { ExerciseContextForm } from "@/components/ExerciseContextForm";
import { ImageUpload } from "@/components/ImageUpload";
import { ModeSelector } from "@/components/ModeSelector";
import { Results } from "@/components/Results";
import { getPersonalizedFakeAnalysis } from "@/lib/context-personalize";
import { FAKE_ANALYSIS_DELAY_MS } from "@/lib/fake-response";
import type { AnalysisMode, AnalysisResult } from "@/lib/types";

export default function Home() {
  const [imageData, setImageData] = useState<{
    base64: string;
    mediaType: string;
  } | null>(null);
  const [enonce, setEnonce] = useState("");
  const [cellule, setCellule] = useState("");
  const [mode, setMode] = useState<AnalysisMode>("urgence");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    if (!imageData) return;

    setLoading(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, FAKE_ANALYSIS_DELAY_MS));

    setResult(
      getPersonalizedFakeAnalysis({
        enonce,
        cellule: cellule.trim() || undefined,
      }),
    );
    setLoading(false);
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8 text-center">
        <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
          Démo
        </span>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Assistant Excel
        </p>
        <h1 className="text-4xl font-semibold tracking-[0.2em] text-[var(--foreground)] sm:text-5xl">
          EXCEN
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          Uploadez votre tableau, décrivez l&apos;exercice — EXCEN décompose la
          formule et traduit sa logique en langage clair.
        </p>
      </header>

      <p className="mb-3 text-xs font-medium text-[var(--foreground)]">
        1. Votre feuille Excel
      </p>
      <ImageUpload
        disabled={loading}
        onImageReady={(base64, mediaType) => {
          setImageData({ base64, mediaType });
          setResult(null);
        }}
        onClear={() => {
          setImageData(null);
          setResult(null);
        }}
      />

      <ExerciseContextForm
        enonce={enonce}
        cellule={cellule}
        onEnonceChange={setEnonce}
        onCelluleChange={setCellule}
        disabled={loading}
      />

      <div className="mt-6">
        <ModeSelector mode={mode} onChange={setMode} disabled={loading} />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={analyze}
          disabled={!imageData || loading}
          className="w-full rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[200px]"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--background)] border-t-transparent" />
              Analyse…
            </span>
          ) : (
            "Analyser"
          )}
        </button>
      </div>

      {result && (
        <div
          key={`${result.categorie}-${result.confiance}-${mode}-${result.celluleCible}`}
        >
          <Results data={result} mode={mode} />
        </div>
      )}
    </main>
  );
}
