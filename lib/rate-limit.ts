import "server-only";

import { getRedis } from "./redis";

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 900;

function failureKey(ip: string): string {
  return `login:fail:${ip}`;
}

export async function isLoginBlocked(ip: string): Promise<boolean> {
  const count = await getRedis().get<number>(failureKey(ip));
  return typeof count === "number" && count >= MAX_ATTEMPTS;
}

export async function registerLoginFailure(ip: string): Promise<void> {
  const key = failureKey(ip);
  const count = await getRedis().incr(key);

  if (count === 1) {
    await getRedis().expire(key, WINDOW_SECONDS);
  }
}

export async function clearLoginFailures(ip: string): Promise<void> {
  await getRedis().del(failureKey(ip));
}
