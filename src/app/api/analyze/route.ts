import { NextResponse } from "next/server";
import { getPersonalizedFakeAnalysis } from "@/lib/context-personalize";

/** Fake MVP : réponse personnalisée selon énoncé / cellule (Claude désactivé) */
export async function POST(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let enonce = "";
  let cellule: string | undefined;
  try {
    const body = await request.json();
    enonce = typeof body.enonce === "string" ? body.enonce : "";
    cellule = typeof body.cellule === "string" ? body.cellule : undefined;
  } catch {
    /* corps vide OK */
  }

  return NextResponse.json(
    getPersonalizedFakeAnalysis({ enonce, cellule }),
  );
}
