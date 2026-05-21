# Excel Coach

Site minimaliste pour tester le concept : upload d'image → réponse exemple (fake MVP).

## Mode actuel : Fake MVP

- Upload d'image (glisser-déposer ou clic)
- Délai ~1,8 s puis **réponse pré-écrite** (explication, formule, étapes)
- Badge « Démo · réponse exemple » — pas de clé API requise
- Objectif : tester design, réactions, viralité avant de brancher Claude

Pour activer la vraie IA plus tard : voir `src/lib/fake-response.ts` et l'ancienne logique dans l'historique git de `api/analyze/route.ts`.

## Prérequis

- [Node.js](https://nodejs.org) (LTS recommandé)

## Installation & lancement

```bash
cd C:\Users\julie\excel-coach
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/page.tsx` — page principale (fake MVP côté client)
- `src/lib/fake-response.ts` — contenu de démo à personnaliser
- `src/components/` — upload et affichage des résultats
