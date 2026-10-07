import "server-only";

import { randomBytes } from "node:crypto";

import { getRedis } from "./redis";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 3600;

function sessionKey(id: string): string {
  return `session:${id}`;
}

export async function createSession(): Promise<string> {
  const id = randomBytes(32).toString("base64url");

  await getRedis().set(sessionKey(id), "1", { ex: SESSION_TTL_SECONDS });

  return id;
}

export async function isValidSession(
  id: string | undefined | null,
): Promise<boolean> {
  if (!id) {
    return false;
  }

  const value = await getRedis().get(sessionKey(id));
  return value !== null;
}

export async function deleteSession(
  id: string | undefined | null,
): Promise<void> {
  if (!id) {
    return;
  }

  await getRedis().del(sessionKey(id));
}
