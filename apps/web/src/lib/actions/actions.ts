"use server";
import "server-only";
import { ActionResult } from "next/dist/server/app-render/types";
import { LoginFormFields, SignUpFormFields } from "../zod/validators";
import { Validate } from "../service/validate";
import { headers } from "next/headers";
import { Auth } from "../service/auth";
import { redirect } from "next/navigation";

export async function loginAction(f: LoginFormFields): Promise<ActionResult> {
  return {
    success: false,
    errors: "Incorrect email or password",
  };
}

const actionRes = {
  badRequest: {
    error: "Bad request",
    success: false,
    status: 400,
  },
  internalError: {
    error: "Internal server error",
    success: false,
    status: 500,
  },
};

type SignUpActionRes =
  | {
      error?: "Id taken" | "Email taken" | string;
      success: boolean;
      status: number;
    }
  | typeof actionRes;
export async function signUpAction(
  unsafe: SignUpFormFields,
): Promise<SignUpActionRes | void> {
  const h = await headers();
  const referer = h.get("referer");

  const sameSiteOk = Validate.isSameSite(referer);
  if (sameSiteOk.isErr()) {
    switch (sameSiteOk.error.type) {
      case "No referer":
        return actionRes.badRequest;
    }
  }
  if (!sameSiteOk.value) return actionRes.badRequest;

  const data = Validate.sanitizeJson(unsafe);
  const creds = {
    email: data.email,
    password: data.password,
  };
  let authOk = await Auth.createUserWithCreds(creds);
  if (authOk.isErr()) {
    switch (authOk.error.type) {
      case "Id taken":
        authOk = await Auth.createUserWithCreds(creds);
        if (authOk.isErr()) return actionRes.internalError;
        if (!authOk.value) return actionRes.internalError;
        break;
      case "Email taken":
        return {
          success: false,
          status: 400,
          error: "Email taken",
        };
      case "Unknown error":
        return actionRes.internalError;
    }
  }
  redirect("/");
}
