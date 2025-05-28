import { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import { NextRequest } from "next/server";
import { ServerErr } from "../error/types";
import { siteConfig } from "@/config/site";

const DOMAIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : siteConfig.production.url;

type IsSameSiteErr = "No referer";
function isSameSite(
  req: NextRequest,
): Result<boolean, ServerErr<IsSameSiteErr>> {
  const referer = req.headers.get("referer");
  if (!referer) {
    return err({
      type: "No referer",
      message: "There was no referer for the request",
      context: JSON.stringify(req),
    });
  }
  if (!referer.startsWith(DOMAIN)) {
    return ok(false);
  }
  return ok(true);
}

export const Validate = {
  isSameSite,
};
