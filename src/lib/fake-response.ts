import type { AnalysisResult } from "@/lib/types";

export const FAKE_ANALYSIS_DELAY_MS = 2200;

export type FakeAnalysisTemplate = Omit<
  AnalysisResult,
  "confiance" | "contexteEnonce" | "enonceUtilise" | "celluleUtilisateur"
>;

const exam = (pieges: string[]) => ({
  professeurAttend: "",
  piegesClassiques: pieges,
  gagnerTemps: [] as string[],
});

export const FAKE_ANALYSES: FakeAnalysisTemplate[] = [
  {
    categorie: "INDEX + EQUIV",
    titre: "Trouver le prix d'un produit",
    resume:
      "Excel cherche d'abord la ligne du produit, puis lit le prix sur cette même ligne.",
    explicationCourte:
      "En D2, Excel repère le code en colonne B, puis va lire le prix en colonne C au même endroit.",
    difficulte: "Avancé",
    duree: "~5 min",
    celluleCible: "D2",
    colonnesHighlight: ["A", "B", "C"],
    explication: "",
    formule: "=INDEX(C2:C50;EQUIV(A2;B2:B50;0))",
    pourquoiFormule:
      "Sur votre feuille, le code et le prix ne sont pas côte à côte comme dans RECHERCHEV. Cette formule fait la même chose en deux temps : « sur quelle ligne ? » puis « quelle valeur sur cette ligne ? ».",
    logiqueComprehension: [
      "Regardez votre tableau : en colonne B, vous avez la liste des codes produits. En colonne C, les prix. En A2, le code que l'exercice vous demande de chercher.",
      "EQUIV regarde la valeur de A2 et la cherche dans B2 à B50. Quand il la trouve, il retient simplement le numéro de ligne — par exemple « c'est la 7ᵉ ligne du tableau ».",
      "INDEX va ensuite dans la colonne des prix (C2 à C50) et lit la valeur à cette 7ᵉ place. C'est comme si vous pointiez d'abord la bonne ligne sur la feuille, puis la case du prix.",
      "Si le code n'existe pas dans la liste, Excel affiche #N/A : ça veut dire « je ne trouve pas ce produit dans ta colonne B ».",
    ],
    decompositionFormule: [
      {
        expression: "EQUIV(A2;B2:B50;0)",
        role: "Où est le produit ?",
        explanation:
          "Excel cherche le code de A2 dans la colonne B et retient à quelle ligne il se trouve.",
        colorIndex: 2,
      },
      {
        expression: "INDEX(C2:C50;",
        role: "Lire le prix",
        explanation:
          "Une fois la ligne connue, Excel va chercher le montant dans la colonne C.",
        colorIndex: 0,
      },
      {
        expression: "C2:C50",
        role: "Colonne des prix",
        explanation: "Tous les prix du tableau — pas les codes, bien la colonne C.",
        colorIndex: 1,
      },
    ],
    erreursFrequentes: [
      {
        titre: "Lire la mauvaise colonne",
        description:
          "INDEX doit aller dans la colonne des prix (C), pas dans celle des codes (B).",
      },
      {
        titre: "#N/A",
        description:
          "Le code en A2 n’existe pas dans la liste B — vérifiez l’orthographe ou les espaces.",
      },
    ],
    etapes: [],
    conseilExamen: exam([
      "Oublier le ;0 à la fin d’EQUIV : Excel pourrait prendre un code « proche ».",
    ]),
  },
  {
    categorie: "RECHERCHEV",
    titre: "Afficher le prix à partir du code",
    resume:
      "Excel cherche le code dans un petit tableau à droite, puis ramène le prix.",
    explicationCourte:
      "En C2, Excel prend le code en A2, le cherche dans le tableau H à J, et affiche le prix.",
    difficulte: "Moyen",
    duree: "~4 min",
    celluleCible: "C2",
    colonnesHighlight: ["A", "H", "I", "J"],
    explication: "",
    formule: "=RECHERCHEV(A2;H2:J100;3;FAUX)",
    pourquoiFormule:
      "Vous avez un annuaire à part (colonnes H, I, J) : codes à gauche, prix plus loin dans le même bloc. RECHERCHEV est fait pour ça — une seule formule qui cherche et ramène le bon nombre.",
    logiqueComprehension: [
      "Sur la capture, repérez le tableau H2:J100 : c'est la liste de référence. La première colonne de ce bloc (H) contient les codes, une autre colonne (ici la 3ᵉ du bloc, colonne J) contient les prix.",
      "La cellule A2 contient le code à chercher. RECHERCHEV lit A2, parcourt la colonne H du bloc jusqu'à trouver la même valeur, puis copie le prix depuis la colonne demandée.",
      "Le chiffre 3 dans la formule ne veut pas dire « colonne C de la feuille ». C'est « la 3ᵉ colonne à l'intérieur du tableau H:J » : H compte pour 1, I pour 2, J pour 3.",
      "FAUX à la fin dit à Excel : « le code doit être exactement le même ». Sans ça, Excel pourrait prendre un code qui ressemble, et vous auriez le mauvais prix.",
    ],
    decompositionFormule: [
      {
        expression: "A2",
        role: "Le code cherché",
        explanation: "C'est la valeur de votre ligne — le code produit à retrouver.",
        colorIndex: 1,
      },
      {
        expression: "H2:J100",
        role: "L'annuaire",
        explanation:
          "Le tableau où Excel cherche : codes à gauche du bloc, prix dans la 3ᵉ colonne du bloc.",
        colorIndex: 2,
      },
      {
        expression: ";3",
        role: "Quelle colonne ramener",
        explanation:
          "Excel renvoie ce qui est dans la 3ᵉ colonne du bloc — ici le prix.",
        colorIndex: 3,
      },
      {
        expression: ";FAUX",
        role: "Code exact",
        explanation:
          "Le code en A2 doit correspondre exactement à une ligne du tableau.",
        colorIndex: 2,
      },
    ],
    erreursFrequentes: [
      {
        titre: "Le 3 compte dans H:J",
        description:
          "Ce n’est pas la colonne C de la feuille : c’est la 3ᵉ colonne du tableau H à J.",
      },
      {
        titre: "Oublier FAUX",
        description:
          "Sans FAUX à la fin, Excel peut afficher un prix pour un code qui ne correspond pas exactement.",
      },
    ],
    etapes: [],
    conseilExamen: exam([
      "Compter les colonnes en partant de H, pas de la colonne A.",
    ]),
  },
  {
    categorie: "SI imbriqués",
    titre: "Afficher une mention selon la note",
    resume:
      "Excel teste la note plusieurs fois et écrit un texte différent à chaque fois.",
    explicationCourte:
      "En G2, si la note est très haute → « Excellent ». Sinon, si elle est correcte → « Admis ». Sinon → « À revoir ».",
    difficulte: "Moyen",
    duree: "~4 min",
    celluleCible: "G2",
    colonnesHighlight: ["E"],
    explication: "",
    formule: '=SI(E2>=16;"Excellent";SI(E2>=10;"Admis";"À revoir"))',
    pourquoiFormule:
      "L'exercice demande d'afficher un résultat différent selon la note en colonne E. Un seul SI ne suffit pas pour trois textes possibles : on enchaîne un second test seulement si le premier n'est pas validé.",
    logiqueComprehension: [
      "Colonne E : la note de l'élève. Colonne G : ce que vous devez remplir — un mot qui change selon la note.",
      "Excel teste d'abord si la note en E2 est ≥ 16. Si oui, il écrit directement « Excellent » et s'arrête là.",
      "Si la première condition n'est pas remplie, Excel continue avec la suivante : est-ce que E2 est au moins 10 ? Si oui, il écrit « Admis ».",
      "Si aucune des deux conditions n'est vraie, la note est en dessous de 10 et Excel écrit « À revoir ». Pas besoin d'un troisième test : c'est le cas par défaut.",
    ],
    decompositionFormule: [
      {
        expression: "SI(E2>=16;",
        role: "Note très bonne ?",
        explanation:
          "Excel regarde la note en E2. Si elle est au moins 16, il affiche « Excellent ».",
        colorIndex: 0,
      },
      {
        expression: '"Excellent";',
        role: "Résultat",
        explanation: "Le texte affiché quand la note est suffisamment haute.",
        colorIndex: 1,
      },
      {
        expression: "SI(E2>=10;",
        role: "Sinon, note ok ?",
        explanation:
          "Seulement si la note n'était pas ≥ 16 : Excel reteste avec le seuil 10.",
        colorIndex: 2,
      },
      {
        expression: '"Admis";"À revoir")',
        role: "Autres cas",
        explanation:
          "Note entre 10 et 15 → « Admis ». En dessous de 10 → « À revoir ».",
        colorIndex: 3,
      },
    ],
    erreursFrequentes: [
      {
        titre: "Tester 10 avant 16",
        description:
          "Si vous testez le seuil le plus bas en premier, presque tout le monde sera « Admis ».",
      },
      {
        titre: "Point-virgule",
        description:
          "En Excel français, séparez les parties avec ; et mettez les textes entre guillemets.",
      },
    ],
    etapes: [],
    conseilExamen: exam([
      "Une parenthèse en trop ou en moins — Excel affiche souvent une erreur de formule.",
    ]),
  },
  {
    categorie: "INDEX + EQUIV (2D)",
    titre: "Ventes d'un vendeur pour un mois",
    resume:
      "Excel trouve la bonne ligne (vendeur) et la bonne colonne (mois), puis lit le chiffre.",
    explicationCourte:
      "En E2, Excel repère le vendeur en colonne A et le mois en ligne 1, puis lit le nombre au croisement.",
    difficulte: "Avancé",
    duree: "~6 min",
    celluleCible: "E2",
    colonnesHighlight: ["A", "B", "C", "D"],
    explication: "",
    formule: "=INDEX(B2:D50;EQUIV(A2;A2:A50;0);EQUIV(D1;B1:D1;0))",
    pourquoiFormule:
      "Ici la réponse dépend de deux choix : quel vendeur (ligne) et quel mois (colonne). RECHERCHEV ne gère qu'une direction ; cette formule fait comme si vous posiez le doigt sur la case du tableau croisé.",
    logiqueComprehension: [
      "Imaginez un tableau de chiffres au milieu (B2 à D50). À gauche (colonne A), les noms des vendeurs. En haut (ligne 1), les mois.",
      "Le premier EQUIV cherche le nom en A2 dans la liste des vendeurs (colonne A). Il retient par exemple « c'est le vendeur en 4ᵉ ligne ».",
      "Le second EQUIV cherche le mois écrit en D1 (par ex. « Avril ») dans les en-têtes B1 à D1. Il retient « c'est la 3ᵉ colonne du tableau ».",
      "INDEX lit enfin le nombre qui se trouve à ce croisement — la vente de ce vendeur pour ce mois.",
    ],
    decompositionFormule: [
      {
        expression: "EQUIV(A2;A2:A50;0)",
        role: "Quel vendeur ?",
        explanation:
          "Excel trouve à quelle ligne se trouve le nom indiqué en A2.",
        colorIndex: 2,
      },
      {
        expression: "EQUIV(D1;B1:D1;0)",
        role: "Quel mois ?",
        explanation:
          "Excel trouve dans quelle colonne se trouve le mois écrit en D1 (ex. Avril).",
        colorIndex: 3,
      },
      {
        expression: "INDEX(B2:D50;",
        role: "Lire le chiffre",
        explanation:
          "Avec la ligne et la colonne trouvées, Excel lit la vente dans le tableau central.",
        colorIndex: 0,
      },
    ],
    erreursFrequentes: [
      {
        titre: "Mois ou vendeur inversés",
        description:
          "Le nom se cherche en colonne A, le mois dans la ligne d’en-tête (B1:D1).",
      },
      {
        titre: "Libellé du mois",
        description:
          "« Avril » en D1 doit être écrit exactement comme dans l’en-tête du tableau.",
      },
    ],
    etapes: [],
    conseilExamen: exam([
      "La plage B2:D50 doit inclure toutes les colonnes de chiffres, pas une seule.",
    ]),
  },
  {
    categorie: "SI + RECHERCHEV",
    titre: "Prix ou message si code inconnu",
    resume:
      "Excel cherche le prix ; s'il ne trouve pas le code, il affiche un message clair.",
    explicationCourte:
      "En C2, si le code n'est pas dans le tableau → « Code inconnu ». Sinon → le prix.",
    difficulte: "Avancé",
    duree: "~5 min",
    celluleCible: "C2",
    colonnesHighlight: ["A", "H", "J"],
    explication: "",
    formule:
      '=SI(ESTNA(RECHERCHEV(A2;H2:J100;3;FAUX));"Code inconnu";RECHERCHEV(A2;H2:J100;3;FAUX))',
    pourquoiFormule:
      "RECHERCHEV seul laisse #N/A quand le code n'existe pas — difficile à lire. Le SI autour dit simplement à Excel : « si tu n'as rien trouvé, écris Code inconnu, sinon montre le prix ».",
    logiqueComprehension: [
      "Comme un RECHERCHEV classique : code en A2, tableau de référence en H à J, prix dans la 3ᵉ colonne du bloc.",
      "D'abord Excel tente RECHERCHEV. Si le code n'est pas dans le tableau, la cellule serait en erreur (#N/A).",
      "ESTNA regarde si cette recherche a échoué. Si oui, le SI affiche « Code inconnu » — un texte que l'utilisateur comprend tout de suite.",
      "Si le code existe, ESTNA est faux et Excel refait la même RECHERCHEV pour afficher le prix. La formule est longue, mais la logique reste : chercher, sinon message.",
    ],
    decompositionFormule: [
      {
        expression: "RECHERCHEV(A2;H2:J100;3;FAUX)",
        role: "Chercher le prix",
        explanation:
          "Excel cherche le code de A2 dans H et ramène le prix (3ᵉ colonne du bloc).",
        colorIndex: 2,
      },
      {
        expression: "ESTNA(...)",
        role: "Trouvé ou pas ?",
        explanation:
          "Excel vérifie si la recherche a échoué (code absent du tableau).",
        colorIndex: 3,
      },
      {
        expression: 'SI(...;"Code inconnu";',
        role: "Si absent",
        explanation:
          "Quand le code n'existe pas, Excel écrit ce message à la place de l'erreur.",
        colorIndex: 0,
      },
      {
        expression: "RECHERCHEV(...))",
        role: "Si trouvé",
        explanation: "Quand le code est bon, Excel affiche le prix normalement.",
        colorIndex: 1,
      },
    ],
    erreursFrequentes: [
      {
        titre: "Message à l’envers",
        description:
          "« Code inconnu » doit s’afficher quand la recherche échoue, pas quand elle réussit.",
      },
      {
        titre: "Formule en double",
        description:
          "RECHERCHEV apparaît deux fois : c’est normal — une fois pour tester, une fois pour afficher le prix.",
      },
    ],
    etapes: [],
    conseilExamen: exam([
      "Sans FAUX dans RECHERCHEV, un code proche peut donner le mauvais prix.",
    ]),
  },
];

/** @deprecated Utiliser getPersonalizedFakeAnalysis depuis context-personalize */
export { getPersonalizedFakeAnalysis as getRandomFakeAnalysis } from "@/lib/context-personalize";

export const FAKE_ANALYSIS = FAKE_ANALYSES[0];
