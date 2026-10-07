import { NextResponse } from "next/server";

import { verifyAdminPassword } from "@/lib/auth";
import { getClientIp, jsonError } from "@/lib/http";
import {
  clearLoginFailures,
  isLoginBlocked,
  registerLoginFailure,
} from "@/lib/rate-limit";
import { createSession, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request);

  if (await isLoginBlocked(ip)) {
    return jsonError(
      "Demasiados intentos fallidos. Prueba de nuevo en 15 minutos.",
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Datos inválidos.",
      400,
    );
  }

  const isValid = await verifyAdminPassword(parsed.data.password);

  if (!isValid) {
    await registerLoginFailure(ip);
    return jsonError("Contraseña incorrecta.", 401);
  }

  await clearLoginFailures(ip);

  const sessionId = await createSession();
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return response;
}
