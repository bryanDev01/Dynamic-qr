import type { Metadata } from "next";
import { Suspense } from "react";

import { WifiCard } from "./wifi-card";

export const metadata: Metadata = {
  title: "Conexión WiFi",
  description: "Consultá el nombre y la contraseña actual de la red WiFi.",
  robots: { index: false, follow: false },
};

function WifiCardSkeleton() {
  return (
    <div
      className="w-full max-w-md rounded-3xl border border-hairline bg-surface p-7 sm:p-9"
      role="status"
      aria-label="Cargando datos de la red"
    >
      <div className="mb-7 flex flex-col items-center gap-3">
        <div className="h-3 w-32 animate-pulse rounded bg-neutral-800" />
        <div className="h-7 w-48 animate-pulse rounded bg-neutral-800" />
      </div>
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-2xl bg-surface-soft" />
        <div className="h-20 animate-pulse rounded-2xl bg-surface-soft" />
      </div>
      <div className="mt-6 h-11 animate-pulse rounded-xl bg-neutral-800" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

export default function WifiPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_55%)] px-4 py-12">
      <Suspense fallback={<WifiCardSkeleton />}>
        <WifiCard />
      </Suspense>
    </main>
  );
}
