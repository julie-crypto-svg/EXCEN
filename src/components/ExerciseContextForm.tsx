interface ExerciseContextFormProps {
  enonce: string;
  cellule: string;
  onEnonceChange: (value: string) => void;
  onCelluleChange: (value: string) => void;
  disabled?: boolean;
}

export function ExerciseContextForm({
  enonce,
  cellule,
  onEnonceChange,
  onCelluleChange,
  disabled,
}: ExerciseContextFormProps) {
  return (
    <div className="mt-5 space-y-4">
      <p className="text-xs font-medium text-[var(--foreground)]">
        2. Contexte de l&apos;exercice
      </p>
      <div>
        <label
          htmlFor="enonce"
          className="mb-2 block text-xs font-medium text-[var(--foreground)]"
        >
          Collez l&apos;énoncé de l&apos;exercice
        </label>
        <textarea
          id="enonce"
          value={enonce}
          onChange={(e) => onEnonceChange(e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Ex. Calculez le total des ventes trimestrielles pour chaque vendeur en colonne E…"
          className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm leading-snug text-[var(--foreground)] placeholder:text-[var(--muted)]/70 focus:border-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="cellule"
          className="mb-2 block text-xs font-medium text-[var(--foreground)]"
        >
          Cellule à compléter{" "}
          <span className="font-normal text-[var(--muted)]">(optionnel)</span>
        </label>
        <input
          id="cellule"
          type="text"
          value={cellule}
          onChange={(e) => onCelluleChange(e.target.value.toUpperCase())}
          disabled={disabled}
          placeholder="E2"
          maxLength={6}
          className="w-28 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/70 focus:border-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
