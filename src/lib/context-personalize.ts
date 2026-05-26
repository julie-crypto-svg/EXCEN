import { pickRandomConfidence } from "@/lib/confidence";
import type { AnalysisResult, FormulaBlock } from "@/lib/types";
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

  if (
    /estna|#n\/a|code\s*inconnu|erreur|inconnu/.test(t) &&
    /recherchev|recherche\s*v/.test(t)
  ) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "SI + RECHERCHEV");
  }
  if (
    /2d|deux\s*équiv|double\s*équiv|matrice|grille|mois|vendeur.*colonne|ligne\s*et\s*colonne/.test(
      t,
    ) ||
    (/index/.test(t) && /équiv|equiv/.test(t) && /colonne|mois|en-tête|entete/.test(t))
  ) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "INDEX + EQUIV (2D)");
  }
  if (/imbriqu|plusieurs\s*seuil|mention|excellent|admis|cascade/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "SI imbriqués");
  }
  if (/recherchev|recherche\s*v|code\s*produit|prix\s*unitaire/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "RECHERCHEV");
  }
  if (/index|équiv|equiv/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "INDEX + EQUIV");
  }
  if (/\bsi\b|condition|oui|non|objectif|bonus|dépasse|seuil/.test(t)) {
    return FAKE_ANALYSES.findIndex((s) => s.categorie === "SI imbriqués");
  }
  return null;
}

function buildContextPhrase(excerpt: string, categorie: string): string {
  if (!excerpt) return "";
  return `D’après ce que vous décrivez (${categorie.toLowerCase()}) : « ${excerpt} »`;
}

function adaptBlocks(
  blocks: FormulaBlock[],
  defaultCell: string,
  userCell: string | null,
): FormulaBlock[] {
  if (!userCell) return blocks;
  return blocks.map((b) => ({
    ...b,
    expression: adaptToCellule(b.expression, defaultCell, userCell),
    explanation: adaptToCellule(b.explanation, defaultCell, userCell),
  }));
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

  const explicationCourte = adapt(base.explicationCourte);

  const pourquoiFormule = excerpt
    ? `${adapt(base.pourquoiFormule)} Ça colle avec l’exercice que vous avez décrit.`
    : adapt(base.pourquoiFormule);

  const logiqueComprehension = base.logiqueComprehension.map((p) => adapt(p));

  return {
    ...base,
    celluleCible: targetCell,
    formule: adapt(base.formule),
    explicationCourte,
    pourquoiFormule,
    logiqueComprehension,
    decompositionFormule: adaptBlocks(
      base.decompositionFormule,
      defaultCell,
      userCell,
    ),
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
