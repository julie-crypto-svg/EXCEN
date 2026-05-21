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
