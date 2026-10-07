import { getWifiConfig } from "@/lib/wifi";
import { buildWifiUri } from "@/lib/wifi-uri";

import { CopyButton } from "./copy-button";

export async function WifiCard() {
  const { ssid, password } = await getWifiConfig();

  return (
    <article className="w-full max-w-md rounded-3xl border border-hairline bg-surface p-7 shadow-[0_0_60px_-20px_rgba(212,175,55,0.45)] sm:p-9">
      <header className="mb-7 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
          Centro Recreativo
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
          Conexión WiFi
        </h1>
      </header>

      <dl className="space-y-4">
        <div className="rounded-2xl border border-hairline bg-surface-soft px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Nombre de la red
          </dt>
          <dd className="mt-1 text-lg font-medium text-foreground">{ssid}</dd>
        </div>

        <div className="rounded-2xl border border-hairline bg-surface-soft px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Contraseña
          </dt>
          <dd className="mt-1 break-all font-mono text-lg tracking-wide text-gold">
            {password ?? "Sin configurar"}
          </dd>
        </div>
      </dl>

      {password ? (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CopyButton value={password} />
            <a
              href={buildWifiUri(ssid, password)}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gold px-5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Conectarme
            </a>
          </div>

          <div className="mt-7 rounded-2xl border border-hairline bg-black/40 px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              ¿Cómo conectarte?
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-neutral-300">
              <li>Abrí los ajustes de WiFi de tu dispositivo.</li>
              <li>
                Seleccioná la red{" "}
                <span className="font-medium text-gold">{ssid}</span>.
              </li>
              <li>Ingresá la contraseña que aparece arriba.</li>
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              El botón &ldquo;Conectarme&rdquo; intenta abrir el WiFi con los
              datos precargados; si tu dispositivo no lo permite, seguí los
              pasos manualmente.
            </p>
          </div>
        </>
      ) : (
        <p className="mt-6 rounded-2xl border border-hairline bg-black/40 px-5 py-4 text-sm text-neutral-300">
          La contraseña todavía no fue configurada. Consultá con el
          administrador del centro.
        </p>
      )}
    </article>
  );
}
