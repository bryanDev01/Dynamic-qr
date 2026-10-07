import "server-only";

import { io } from "next/cache";

import { getRedis } from "./redis";

const WIFI_CONFIG_KEY = "wifi:config";

export type WifiConfig = {
  ssid: string;
  password: string | null;
  updatedAt: string | null;
};

export function getSsid(): string {
  const ssid = process.env.WIFI_SSID?.trim();
  return ssid && ssid.length > 0 ? ssid : "WiFi del Centro Recreativo";
}

export async function getWifiConfig(): Promise<WifiConfig> {
  await io();

  const raw = await getRedis().hgetall<Record<string, unknown>>(WIFI_CONFIG_KEY);

  return {
    ssid: getSsid(),
    password: typeof raw?.password === "string" ? raw.password : null,
    updatedAt: typeof raw?.updatedAt === "string" ? raw.updatedAt : null,
  };
}

export async function updateWifiPassword(password: string): Promise<string> {
  const updatedAt = new Date().toISOString();

  await getRedis().hset(WIFI_CONFIG_KEY, { password, updatedAt });

  return updatedAt;
}
