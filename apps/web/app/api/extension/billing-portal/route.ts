import type { NextRequest } from "next/server";
import { jsonWithCors, optionsWithCors } from "@/lib/cors";
import { getServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export function OPTIONS(request: NextRequest) {
  return optionsWithCors(request);
}

export async function POST(request: NextRequest) {
  const env = getServerEnv();

  return jsonWithCors(
    request,
    { url: env.billingPortalFallbackUrl },
    { headers: { "Cache-Control": "no-store" } }
  );
}
