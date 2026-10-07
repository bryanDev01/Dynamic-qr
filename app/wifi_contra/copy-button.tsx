"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
};

type CopyStatus = "idle" | "copied" | "error";

export function CopyButton({ value }: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        document.body.removeChild(field);
      }

      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 text-base font-semibold text-black transition-colors hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      aria-live="polite"
    >
      {status === "copied"
        ? "¡Copiada!"
        : status === "error"
          ? "No se pudo copiar"
          : "Copiar"}
    </button>
  );
}
