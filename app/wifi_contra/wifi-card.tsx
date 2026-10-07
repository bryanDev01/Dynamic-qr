import Image from "next/image";

import { getWifiConfig } from "@/lib/wifi";

import { CopyButton } from "./copy-button";

function WifiIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

export async function WifiCard() {
  const { ssid, password } = await getWifiConfig();

  return (
    <article className="w-full max-w-md rounded-3xl border border-hairline bg-surface p-5 shadow-[0_0_60px_-20px_rgba(212,175,55,0.45)] sm:p-6">
      <header className="mb-4 flex flex-col items-center text-center">
        <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <WifiIcon />
        </span>
        <Image
          src="/el_cabildo_logo.png"
          alt="El Cabildo"
          width={148}
          height={84}
          priority
          className="h-auto w-[148px]"
        />
        <h1 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
          Conexión WiFi
        </h1>
      </header>

      <dl className="space-y-2.5">
        <div className="rounded-2xl border border-hairline bg-surface-soft px-4 py-2.5">
          <dt className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-400">
            Nombre de la red
          </dt>
          <dd className="mt-0.5 text-base font-medium text-foreground">
            {ssid}
          </dd>
        </div>

        <div className="rounded-2xl border border-hairline bg-surface-soft px-4 py-2.5">
          <dt className="text-[0.65rem] font-medium uppercase tracking-widest text-neutral-400">
            Contraseña
          </dt>
          <dd className="mt-0.5 break-all font-mono text-base tracking-wide text-gold">
            {password ?? "Sin configurar"}
          </dd>
        </div>
      </dl>

      {password ? (
        <>
          <div className="mt-4">
            <CopyButton value={password} />
          </div>

          <div className="mt-4 rounded-2xl border border-hairline bg-black/40 px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              ¿Cómo conectarte?
            </h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-snug text-neutral-300">
              <li>Abrí los ajustes de WiFi de tu dispositivo.</li>
              <li>
                Seleccioná la red{" "}
                <span className="font-medium text-gold">{ssid}</span>.
              </li>
              <li>Ingresá la contraseña que aparece arriba.</li>
            </ol>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-2xl border border-hairline bg-black/40 px-4 py-3 text-sm text-neutral-300">
          La contraseña todavía no fue configurada. Consultá con el
          administrador del centro.
        </p>
      )}
    </article>
  );
}
