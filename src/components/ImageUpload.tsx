"use client";

import { useCallback, useRef, useState } from "react";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface ImageUploadProps {
  onImageReady: (base64: string, mediaType: string, previewUrl: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  onImageReady,
  onClear,
  disabled,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED.includes(file.type)) {
        setError("Format accepté : JPEG, PNG, GIF ou WebP.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image trop lourde (maximum 5 Mo).");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        onImageReady(base64, file.type, previewUrl);
      };
      reader.onerror = () => setError("Impossible de lire le fichier.");
      reader.readAsDataURL(file);
    },
    [onImageReady],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear();
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!disabled) handleFiles(e.dataTransfer.files);
          }}
          className={`
            flex min-h-[220px] cursor-pointer flex-col items-center justify-center
            rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all
            sm:min-h-[260px]
            ${dragOver ? "border-[var(--foreground)] bg-[var(--formula-bg)]" : "border-[var(--border)]"}
            ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-[var(--muted)]"}
          `}
        >
          <svg
            className="mb-4 h-10 w-10 text-[var(--muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5h18M3 9h18M7 13h4M7 17h10M5 5v14a1 1 0 001 1h12a1 1 0 001-1V5"
            />
          </svg>
          <p className="text-base font-medium text-[var(--foreground)]">
            Photo ou capture de votre feuille Excel
          </p>
          <p className="mx-auto mt-2 max-w-[300px] text-sm leading-relaxed text-[var(--muted)]">
            Colonnes, en-têtes et cellules visibles — EXCEN relie chaque bloc de
            formule à votre tableau.
          </p>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Glisser-déposer · clic pour parcourir · max 5 Mo
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Aperçu de votre feuille Excel"
            className="max-h-[320px] w-full object-contain p-4"
          />
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="absolute right-3 top-3 rounded-full bg-[var(--foreground)] px-3 py-1 text-xs font-medium text-[var(--background)] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            Changer
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
