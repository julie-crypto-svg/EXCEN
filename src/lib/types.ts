export type AnalysisMode = "urgence" | "apprentissage";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface FrequentError {
  titre: string;
  description: string;
}

export interface ConseilExamen {
  professeurAttend: string;
  piegesClassiques: string[];
  gagnerTemps: string[];
}

/** Bloc coloré d'une formule décomposée */
export interface FormulaBlock {
  /** Fragment affiché (ex. EQUIV(A2;B2:B50;0)) */
  expression: string;
  /** Rôle court optionnel (ex. « Position ») */
  role?: string;
  /** Explication pédagogique du bloc */
  explanation: string;
  /** Index 0–4 pour la couleur discrète */
  colorIndex: number;
}

export interface AnalysisResult {
  categorie: string;
  titre: string;
  resume: string;
  /** Une phrase — mode urgence */
  explicationCourte: string;
  difficulte: "Facile" | "Moyen" | "Avancé";
  duree: string;
  celluleCible: string;
  colonnesHighlight?: string[];
  confiance: ConfidenceLevel;
  explication: string;
  formule: string;
  pourquoiFormule: string;
  /** Section « Comprendre la logique » — paragraphes liés au tableau */
  logiqueComprehension: string[];
  /** Décomposition visuelle de la formule */
  decompositionFormule: FormulaBlock[];
  erreursFrequentes: FrequentError[];
  etapes: string[];
  conseilExamen: ConseilExamen;
  /** Extrait contextualisé affiché dans le résultat */
  contexteEnonce?: string;
  enonceUtilise?: boolean;
  celluleUtilisateur?: boolean;
}

export interface AnalyzeRequest {
  image: string;
  mediaType: string;
}
