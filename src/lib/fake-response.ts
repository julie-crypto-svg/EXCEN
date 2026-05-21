import type { AnalysisResult } from "@/lib/types";

export const FAKE_ANALYSIS_DELAY_MS = 2200;

export type FakeAnalysisTemplate = Omit<
  AnalysisResult,
  "confiance" | "contexteEnonce" | "enonceUtilise" | "celluleUtilisateur"
>;

export const FAKE_ANALYSES: FakeAnalysisTemplate[] = [
  {
    categorie: "SOMME",
    titre: "Total des ventes par vendeur",
    resume: "Somme des 3 mois par ligne.",
    explicationCourte: "E2 : additionnez B2 à D2, puis recopiez.",
    difficulte: "Facile",
    duree: "~2 min",
    celluleCible: "E2",
    colonnesHighlight: ["B", "C", "D"],
    explication: "",
    formule: "=SOMME(B2:D2)",
    pourquoiFormule:
      "SOMME fait la somme d'un coup — plus sûr que B2+C2+D2. Plage B2:D2 = les 3 mois, sans l'en-tête.",
    erreursFrequentes: [
      { titre: "Pas de =", description: "Sans =, Excel ne calcule pas." },
      { titre: "Plage trop large", description: "N'incluez pas la colonne A (texte)." },
      { titre: "Mauvaise recopie", description: "B2:D2 doit devenir B3:D3, etc." },
    ],
    etapes: [
      "Cliquez E2.",
      "Tapez =SOMME(B2:D2).",
      "Entrée, puis recopiez vers le bas.",
    ],
    conseilExamen: {
      professeurAttend: "",
      piegesClassiques: [
        "Additionner la colonne des noms par erreur.",
        "Oublier de recopier sur toutes les lignes.",
      ],
      gagnerTemps: [],
    },
  },
  {
    categorie: "SI",
    titre: "Bonus si objectif atteint",
    resume: "Oui/Non selon objectif.",
    explicationCourte: "G2 : Oui si E2 ≥ F2, sinon Non.",
    difficulte: "Moyen",
    duree: "~3 min",
    celluleCible: "G2",
    colonnesHighlight: ["E", "F"],
    explication: "",
    formule: '=SI(E2>=F2;"Oui";"Non")',
    pourquoiFormule:
      "SI teste E2≥F2 et renvoie du texte. En Excel FR : point-virgule entre les arguments.",
    erreursFrequentes: [
      { titre: "Virgules anglaises", description: "Utilisez ; pas , entre les arguments." },
      { titre: "Texte sans guillemets", description: '"Oui" et "Non" entre guillemets.' },
      { titre: "Mauvaises cellules", description: "Total en E, objectif en F." },
    ],
    etapes: [
      "En G2 : =SI(E2>=F2;",
      'Ajoutez "Oui";"Non")',
      "Entrée, recopiez vers le bas.",
    ],
    conseilExamen: {
      professeurAttend: "",
      piegesClassiques: [
        "Inverser Oui et Non dans la formule.",
        "Comparer E avec la mauvaise colonne.",
      ],
      gagnerTemps: [],
    },
  },
  {
    categorie: "RECHERCHEV",
    titre: "Prix depuis le code produit",
    resume: "Chercher le prix dans un tableau.",
    explicationCourte: "C2 : prix du code A2 dans H:J, colonne 3, FAUX.",
    difficulte: "Moyen",
    duree: "~4 min",
    celluleCible: "C2",
    colonnesHighlight: ["A"],
    explication: "",
    formule: "=RECHERCHEV(A2;H2:J100;3;FAUX)",
    pourquoiFormule:
      "RECHERCHEV trouve A2 dans H et renvoie la 3ᵉ colonne (prix). FAUX = correspondance exacte obligatoire.",
    erreursFrequentes: [
      { titre: "Sans FAUX", description: "Risque de mauvais prix approximatif." },
      { titre: "Mauvais n° colonne", description: "H=1, I=2, J=3 depuis le début du tableau." },
      { titre: "#N/A", description: "Code absent ou espace en trop dans A2." },
    ],
    etapes: [
      "Repérez le tableau H:J (codes, prix).",
      "C2 : =RECHERCHEV(A2;H2:J100;3;FAUX)",
      "Validez, recopiez si besoin ($ sur H:J).",
    ],
    conseilExamen: {
      professeurAttend: "",
      piegesClassiques: [
        "Compter les colonnes depuis A au lieu de H.",
        "Oublier FAUX sur un code produit.",
      ],
      gagnerTemps: [],
    },
  },
  {
    categorie: "INDEX / EQUIV",
    titre: "Stock avec INDEX + EQUIV",
    resume: "Trouver une valeur sans RECHERCHEV.",
    explicationCourte: "D2 : EQUIV trouve la ligne, INDEX renvoie le stock.",
    difficulte: "Avancé",
    duree: "~5 min",
    celluleCible: "D2",
    colonnesHighlight: ["A", "B"],
    explication: "",
    formule: "=INDEX(C2:C50;EQUIV(A2;B2:B50;0))",
    pourquoiFormule:
      "EQUIV donne la position du produit en B. INDEX lit la valeur au même rang en C.",
    erreursFrequentes: [
      { titre: "Sans ;0", description: "Le 0 force la correspondance exacte." },
      { titre: "Mauvaise colonne INDEX", description: "INDEX doit viser C (stocks), pas B." },
      { titre: "Plages différentes", description: "B2:B50 et C2:C50 : même hauteur." },
    ],
    etapes: [
      "D2 : =INDEX(C2:C50;",
      "Ajoutez EQUIV(A2;B2:B50;0))",
      "Entrée, testez puis recopiez.",
    ],
    conseilExamen: {
      professeurAttend: "",
      piegesClassiques: [
        "Produit introuvable → #N/A.",
        "Plages B et C pas alignées.",
      ],
      gagnerTemps: [],
    },
  },
  {
    categorie: "NB.SI",
    titre: "Compter au-dessus du seuil",
    resume: "Nombre de lignes > 10 000.",
    explicationCourte: "Une formule compte les totaux E2:E50 > 10 000.",
    difficulte: "Facile",
    duree: "~2 min",
    celluleCible: "G1",
    colonnesHighlight: ["E"],
    explication: "",
    formule: '=NB.SI(E2:E50;">10000")',
    pourquoiFormule:
      'NB.SI compte les cellules qui respectent le critère ">10000" — guillemets obligatoires.',
    erreursFrequentes: [
      { titre: "Critère mal écrit", description: 'Écrivez ">10000" entre guillemets.' },
      { titre: "En-tête inclus", description: "Commencez en E2, pas E1." },
      { titre: "NB au lieu de NB.SI", description: "NB compte tout, pas selon un seuil." },
    ],
    etapes: [
      "Cellule résultat (ex. G1).",
      '=NB.SI(E2:E50;">10000")',
      "Entrée — le nombre s'affiche.",
    ],
    conseilExamen: {
      professeurAttend: "",
      piegesClassiques: [
        "Totaux en texte, pas en nombre.",
        "Seuil mal recopié depuis l'énoncé.",
      ],
      gagnerTemps: [],
    },
  },
];

/** @deprecated Utiliser getPersonalizedFakeAnalysis depuis context-personalize */
export { getPersonalizedFakeAnalysis as getRandomFakeAnalysis } from "@/lib/context-personalize";

export const FAKE_ANALYSIS = FAKE_ANALYSES[0];
