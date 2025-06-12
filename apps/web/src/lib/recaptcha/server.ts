import "server-only";
import { env } from "@/config/env";
import { ReCaptchaVerifyResponse } from "./types";
import { safeFetch, SafeFetchErr } from "../utils/serverUtils";
import { err, ok } from "neverthrow";
import { AsyncResult } from "../error/types";

const CAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

type VerifyTokenErr = "Recaptcha google server error" | SafeFetchErr;
export async function verifyRecaptchaToken(
  token: string,
): AsyncResult<ReCaptchaVerifyResponse, VerifyTokenErr> {
  const res = await safeFetch<ReCaptchaVerifyResponse>(CAPTCHA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.RECAPTCHA_SECRET_KEY,
      response: token,
    }),
  });

  if (res.isErr()) {
    return err(res.error);
  }

  if (!res.value.response.ok) {
    return err({
      type: "Recaptcha google server error",
      message: "Googles servers returned an error in verifyRecaptchaToken",
      cause: new Error("Recaptcha google server error"),
      context: JSON.stringify(res.value.data),
    });
  }

  if (!res.value.data.score)
    return err({
      type: "Recaptcha google server error",
      message:
        "Google servers returned an known type. Expected 'score' property",
      cause: new Error("Recaptcha google server error"),
      context: JSON.stringify(res.value.data),
    });

  return ok(res.value.data);
}
