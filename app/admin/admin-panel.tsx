"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminPanelProps = {
  ssid: string;
  initialUpdatedAt: string | null;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));
}

export function AdminPanel({ ssid, initialUpdatedAt }: AdminPanelProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(initialUpdatedAt);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setSuccess(null);
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/wifi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.status === 401) {
        router.refresh();
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        updatedAt?: string;
      } | null;

      if (!response.ok) {
        setError(data?.error ?? "No se pudo actualizar la contraseña.");
        return;
      }

      setPassword("");
      setConfirm("");
      setUpdatedAt(data?.updatedAt ?? new Date().toISOString());
      setSuccess("Contraseña actualizada. Ya está visible para los clientes.");
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setPending(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Panel
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Gestión de la WiFi</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex h-10 items-center rounded-xl border border-hairline px-4 text-sm font-medium text-neutral-300 transition-colors hover:border-gold hover:text-gold disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {loggingOut ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </header>

      <section className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Contraseña de la red</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Cambiá la contraseña en el router y luego registrá aquí la misma
          contraseña nueva para que los clientes la vean.
        </p>

        <div className="mt-4 rounded-2xl border border-hairline bg-surface-soft px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Red (no editable)
          </p>
          <p className="mt-1 text-lg font-medium">{ssid}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-neutral-300"
            >
              Nueva contraseña
            </label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={63}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-hairline bg-black/50 px-4 outline-none transition-colors focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-neutral-300"
            >
              Repetir contraseña
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={63}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-hairline bg-black/50 px-4 outline-none transition-colors focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="text-sm text-emerald-400">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-semibold text-black transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto"
          >
            {pending ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>

        {updatedAt ? (
          <p className="mt-4 text-xs text-neutral-500">
            Última actualización: {formatDate(updatedAt)}
          </p>
        ) : (
          <p className="mt-4 text-xs text-neutral-500">
            Todavía no se registró ninguna contraseña.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Código QR</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Este QR apunta siempre a la página de conexión. Imprimilo una vez: no
          cambia cuando actualizás la contraseña.
        </p>

        <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="rounded-2xl bg-white p-3">
            <Image
              src="/api/admin/qr"
              alt="Código QR que enlaza a la página de conexión WiFi"
              width={192}
              height={192}
              unoptimized
            />
          </div>
          <a
            href="/api/admin/qr"
            download="wifi-qr.png"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gold px-5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Descargar QR (PNG)
          </a>
        </div>
      </section>
    </div>
  );
}
