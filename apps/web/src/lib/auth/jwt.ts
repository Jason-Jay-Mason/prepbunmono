import j from "jsonwebtoken";
import { Result, ok, err } from "neverthrow";
import { getErr, ServerErr } from "../error/utils";
import { Secret, Claims, Token, ParseJwtError } from "./types";
import { VerifyClaimsSchema } from "./validators";

function generate(s: Secret, c: Claims) {
  return j.sign(c, s);
}

function parse(t: Token, s: Secret): Result<Claims, ServerErr<ParseJwtError>> {
  try {
    const claims = j.verify(t, s);
    const res = VerifyClaimsSchema.safeParse(claims);
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

export const jwt = {
  parse,
  generate,
};
