import j from "jsonwebtoken";
import { Result, ok, err } from "neverthrow";
import { getErr } from "../error/utils";
import { Secret, Claims, Token } from "./types";
import { generateClaimsSchema, praseClaimsSchema } from "./validators";
import { ServerErr, SyncResult } from "../error/types";

export type GenerateClaimsError = "Invalid secret" | "Invalid claims object";
function generate(
  s: Secret,
  c: Claims,
): Result<string, ServerErr<GenerateClaimsError>> {
  if (typeof s !== "string") {
    return err({
      type: "Invalid secret",
      message: "The secret passed to generate jwt claims was not a string",
      context: new Error("Invalid secret").stack,
    });
  }
  const res = generateClaimsSchema.safeParse(c);
  if (res.error) {
    return err({
      type: "Invalid claims object",
      message:
        "Generate jwt claims recieved an invalid claims object. Sombody may be trying to spoof claims.",
      cause: res.error,
      context: res.error.stack,
    });
  }
  return ok(j.sign(c, s + c.sessionType));
}

export type ParseJwtError =
  | "Unknown JWT parse error"
  | "Invalid JWT signature"
  | "JWT malformed"
  | "Invalid claims object";
function verify(t: Token, s: Secret): Result<Claims, ServerErr<ParseJwtError>> {
  try {
    const claims = j.verify(t, s);
    const res = praseClaimsSchema.safeParse(claims);
    if (res.error) {
      return err({
        type: "Invalid claims object",
        message:
          "parseJwt recieved a claims object that was not the valid type. This is a zod error.",
        cause: res.error,
        context: res.error.stack,
      });
    }
    return ok(res.data);
  } catch (unsafe) {
    const e = getErr(unsafe);
    switch (e.message) {
      case "invalid signature":
        return err({
          type: "Invalid JWT signature",
          message: e.message,
          cause: e,
          context: e.stack,
        });
      case "jwt malformed":
        return err({
          type: "JWT malformed",
          message: e.message,
          cause: e,
          context: e.stack,
        });
      default:
        return err({
          type: "Unknown JWT parse error",
          message: "Unkown parse JWT error",
          cause: e,
          context: e.stack,
        });
    }
  }
}

export function parseWithSessionTypes(
  t: Token,
  secret: string,
  types: string[],
): SyncResult<Claims, "Invalid jwt"> {
  for (const type of types) {
    const res = verify(t, secret + type);
    if (res.isOk()) return ok(res.value);
  }
  return err({
    type: "Invalid jwt",
    stack: new Error().stack,
  });
}
export const jwt = {
  parseWithSessionTypes,
  verify,
  generate,
};
