import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { updateWifiSchema } from "@/lib/validation";
import { updateWifiPassword } from "@/lib/wifi";

export async function PUT(request: Request): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return jsonError("No autorizado.", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  const parsed = updateWifiSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Datos inválidos.",
      400,
    );
  }

  const updatedAt = await updateWifiPassword(parsed.data.password);

  return NextResponse.json({ ok: true, updatedAt });
}
