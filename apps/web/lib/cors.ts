import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getAllowedOrigins() {
  return (process.env.EXTENSION_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function buildCorsHeaders(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();
  const allowAny = allowedOrigins.includes("*");
  const isAllowed = requestOrigin && allowedOrigins.includes(requestOrigin);
  const headers = new Headers();

  if (allowAny) {
    headers.set("Access-Control-Allow-Origin", requestOrigin || "*");
  } else if (isAllowed && requestOrigin) {
    headers.set("Access-Control-Allow-Origin", requestOrigin);
  }

  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type,X-Extension-Version"
  );
  headers.set("Access-Control-Max-Age", "600");

  return headers;
}

export function optionsWithCors(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request)
  });
}

export function jsonWithCors<T>(
  request: NextRequest,
  body: T,
  init: ResponseInit = {}
) {
  const headers = new Headers(init.headers);
  buildCorsHeaders(request).forEach((value, key) => headers.set(key, value));

  return NextResponse.json(body, {
    ...init,
    headers
  });
}
