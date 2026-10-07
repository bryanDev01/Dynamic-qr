import "server-only";

import { NextResponse } from "next/server";

export function getClientIp(request: Request): string {
  const direct = request.headers.get("x-real-ip")?.trim();
  if (direct) {
    return direct;
  }

  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const first = vercel.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return "unknown";
}

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
