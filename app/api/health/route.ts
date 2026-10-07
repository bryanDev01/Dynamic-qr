import { NextResponse } from "next/server";
import { io } from "next/cache";

import { getRedis } from "@/lib/redis";

const HEALTH_KEY = "health:last";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET no configurado." },
      { status: 503 },
    );
  }

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await io();

  const stamp = new Date().toISOString();
  await getRedis().set(HEALTH_KEY, stamp);
  const last = await getRedis().get<string>(HEALTH_KEY);

  return NextResponse.json(
    { ok: true, last, at: stamp },
    { headers: { "Cache-Control": "no-store" } },
  );
}
