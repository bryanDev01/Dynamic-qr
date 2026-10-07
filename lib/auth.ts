import "server-only";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { SESSION_COOKIE, isValidSession } from "./session";

export async function verifyAdminPassword(
  password: string,
): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (!hash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export async function getSessionId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const id = await getSessionId();
  return isValidSession(id);
}
