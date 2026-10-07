import type { Metadata } from "next";
import { Suspense } from "react";

import { isAdminAuthenticated } from "@/lib/auth";
import { getWifiConfig } from "@/lib/wifi";

import { AdminPanel } from "./admin-panel";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

function AdminSkeleton() {
  return (
    <div
      className="w-full max-w-sm rounded-3xl border border-hairline bg-surface p-8"
      role="status"
      aria-label="Verificando sesión"
    >
      <div className="h-3 w-28 animate-pulse rounded bg-neutral-800" />
      <div className="mt-4 h-7 w-44 animate-pulse rounded bg-neutral-800" />
      <div className="mt-6 h-11 animate-pulse rounded-xl bg-neutral-800" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

async function AdminContent() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginForm />;
  }

  const { ssid, updatedAt } = await getWifiConfig();

  return <AdminPanel ssid={ssid} initialUpdatedAt={updatedAt} />;
}

export default function AdminPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_55%)] px-4 py-12">
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent />
      </Suspense>
    </main>
  );
}
