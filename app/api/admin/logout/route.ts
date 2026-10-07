import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE, deleteSession } from "@/lib/session";

export async function POST(): Promise<NextResponse> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;

  await deleteSession(sessionId);

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
