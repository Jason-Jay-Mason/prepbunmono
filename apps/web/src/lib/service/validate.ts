import { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import { ServerErr } from "../error/types";
import { siteConfig } from "@/config/site";
import escape from "validator/lib/escape";
import xss from "xss";

const DOMAIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : siteConfig.production.url;

type IsSameSiteErr = "No referer";
function isSameSite(
  referer: string | null,
): Result<boolean, ServerErr<IsSameSiteErr>> {
  if (!referer) {
    return err({
      type: "No referer",
      message: "There was no referer for the request",
      context: referer,
    });
  }
  if (!referer.startsWith(DOMAIN)) {
    return ok(false);
  }
  return ok(true);
}

function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    return escape(xss(value));
  }
  return value;
}

function sanitizeJson<T extends object | string | number | boolean | null>(
  obj: T,
): T {
  if (typeof obj !== "object" || obj === null) {
    return sanitizeValue(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeJson(item)) as T;
  }

  const sanitized = Object.entries(obj as object).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: sanitizeJson(value),
    }),
    {} as Record<string, any>,
  );

  return sanitized as T;
}

export function rateLimitByIp() {}

export const Validate = {
  isSameSite,
  sanitizeJson,
  sanitizeValue,
};
