import type { MiddlewareHandler } from "hono";
import type { Bindings } from "../types";

const TOKEN_COOKIE = "app_token";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function extractToken(c: Parameters<MiddlewareHandler<{ Bindings: Bindings }>>[0]): string | null {
  const header = c.req.header("Authorization");
  if (header?.startsWith("Bearer ")) return header.slice("Bearer ".length);

  const cookieHeader = c.req.header("Cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(TOKEN_COOKIE.length + 1)) : null;
}

export const requireToken: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const token = extractToken(c);
  if (!token || !timingSafeEqual(token, c.env.APP_TOKEN)) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};

export { TOKEN_COOKIE };
