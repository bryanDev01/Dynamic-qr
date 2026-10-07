import { NextResponse } from "next/server";

import { getWifiConfig } from "@/lib/wifi";

export async function GET(): Promise<NextResponse> {
  const { ssid, password } = await getWifiConfig();

  return NextResponse.json(
    { ssid, password },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    },
  );
}
