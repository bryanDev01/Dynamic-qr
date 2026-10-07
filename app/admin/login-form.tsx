"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PasswordInput } from "@/app/components/password-input";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "No se pudo iniciar sesión.");
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-hairline bg-surface p-7 shadow-[0_0_60px_-25px_rgba(212,175,55,0.4)] sm:p-8"
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
        Administración
      </p>
      <h1 className="mt-3 text-2xl font-semibold">Ingresá al panel</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Introducí la contraseña de administrador para gestionar la red WiFi.
      </p>

      <div className="mt-6">
        <PasswordInput
          id="admin-password"
          label="Contraseña de administrador"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={setPassword}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gold px-5 text-sm font-semibold text-black transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
