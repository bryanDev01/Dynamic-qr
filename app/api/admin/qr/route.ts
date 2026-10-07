import { NextResponse } from "next/server";
import QRCode from "qrcode";

import { isAdminAuthenticated } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { getBaseUrl } from "@/lib/url";

export async function GET(request: Request): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return jsonError("No autorizado.", 401);
  }

  const targetUrl = `${getBaseUrl(request)}/wifi_contra`;
  const png = await QRCode.toBuffer(targetUrl, {
    type: "png",
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
