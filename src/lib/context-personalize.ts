import { pickRandomConfidence } from "@/lib/confidence";
import type { AnalysisResult } from "@/lib/types";
import { FAKE_ANALYSES, type FakeAnalysisTemplate } from "@/lib/fake-response";

export interface AnalysisContext {
  enonce: string;
  cellule?: string;
}

function normalizeCellule(input: string): string | null {
  const match = input.trim().toUpperCase().match(/^([A-Z]{1,3})([0-9]{1,5})$/);
  if (!match) return null;
  return `${match[1]}${match[2]}`;
}

function rowFromCell(cell: string): string {
  return cell.match(/[0-9]+/)?.[0] ?? "2";
}

/** Adapte formule, étapes et textes à la cellule saisie */
function adaptToCellule(text: string, defaultCell: string, userCell: string): string {
  const oldRow = rowFromCell(defaultCell);
  const newRow = rowFromCell(userCell);
  let out = text.replace(new RegExp(defaultCell, "gi"), userCell);
  out = out.replace(
    new RegExp(`([A-Z]{1,3})${oldRow}(?![0-9])`, "gi"),
    `$1${newRow}`,
  );
  return out;
}

function excerptEnonce(enonce: string, max = 72): string {
  const trimmed = enonce.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const cut = trimmed.split(/[.!?\n]/)[0] || trimmed;
  return cut.length > max ? `${cut.slice(0, max).trim()}…` : cut;
}

function detectScenarioIndex(enonce: string): number | null {
  const t = enonce.toLowerCase();
  if (/recherchev|recherche\s*v|code\s*produit|prix\s*unitaire/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "RECHERCHEV");
  }
  if (/index|équiv|equiv/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "INDEX / EQUIV");
  }
  if (/nb\.?si|compter|nombre\s+de|combien/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "NB.SI");
  }
  if (/\bsi\b|condition|oui|non|objectif|bonus|dépasse/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "SI");
  }
  if (/somme|total|addition|janvier|février|mars|trimestre/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "SOMME");
  }
  return null;
}

function buildContextPhrase(excerpt: string, categorie: string): string {
  if (!excerpt) return "";
  return `Votre énoncé évoque un exercice type « ${categorie} » — ${excerpt}`;
}

function personalizeCopy(
  base: FakeAnalysisTemplate,
  userCell: string | null,
  excerpt: string,
): Omit<AnalysisResult, "confiance"> {
  const defaultCell = base.celluleCible;
  const targetCell = userCell ?? defaultCell;
  const adapt = (s: string) =>
    userCell ? adaptToCellule(s, defaultCell, targetCell) : s;

  const contexteEnonce = buildContextPhrase(excerpt, base.categorie);

  const explicationCourte = excerpt
    ? `${adapt(base.explicationCourte)} — aligné avec : « ${excerpt} »`
    : adapt(base.explicationCourte);

  const pourquoiFormule = excerpt
    ? `${adapt(base.pourquoiFormule)} Cela répond à l'énoncé.`
    : adapt(base.pourquoiFormule);

  const etapes = base.etapes.map((e, i) => {
    const step = adapt(e);
    if (i === 0 && excerpt && userCell) {
      return `${step} (énoncé + cellule ${targetCell})`;
    }
    return step;
  });

  return {
    ...base,
    celluleCible: targetCell,
    formule: adapt(base.formule),
    explicationCourte,
    pourquoiFormule,
    etapes,
    erreursFrequentes: base.erreursFrequentes.map((err) => ({
      ...err,
      description: adapt(err.description),
    })),
    contexteEnonce: contexteEnonce || undefined,
    enonceUtilise: Boolean(excerpt),
    celluleUtilisateur: Boolean(userCell),
  };
}

export function getPersonalizedFakeAnalysis(
  context: AnalysisContext = { enonce: "" },
): AnalysisResult {
  const excerpt = excerptEnonce(context.enonce);
  const userCell = context.cellule
    ? normalizeCellule(context.cellule)
    : null;

  let index = detectScenarioIndex(context.enonce);
  if (index === null || index < 0) {
    index = Math.floor(Math.random() * FAKE_ANALYSES.length);
  }

  const base = FAKE_ANALYSES[index];
  const personalized = personalizeCopy(base, userCell, excerpt);

  const confiance =
    !excerpt && !userCell
      ? pickRandomConfidence()
      : excerpt && userCell
        ? "high"
        : excerpt || userCell
          ? "medium"
          : pickRandomConfidence();

  return { ...personalized, confiance };
}
