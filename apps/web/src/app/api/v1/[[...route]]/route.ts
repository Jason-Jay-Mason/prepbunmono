import { siteConfig } from "@/config/site";
import { users } from "@/lib/db/models/users";
import { verifyRecaptchaToken } from "@/lib/recaptcha/server";
import { auth } from "@/lib/service/auth";
import { Validate } from "@/lib/service/validate";
import { signupFormRequestSchema } from "@/lib/zod/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import posthog from "posthog-js";

const app = new Hono().basePath("/api/v1");

app.onError((err, c) => {
  console.error(err);
  posthog.captureException(err);
  return c.json(
    {
      error: "Internal server error",
      message: "An error occurred",
      data: null,
    },
    500,
  );
});

const routes = app.post(
  "/auth/signup",
  zValidator("json", signupFormRequestSchema, (res, c) => {
    if (!res.success)
      return c.json(
        {
          error: "Bad request",
          message: "Malformed request",
          data: null,
        },
        400,
      );
  }),
  async (c) => {
    const { form, recaptcha } = Validate.sanitizeJson(c.req.valid("json"));
    const userAgent = Validate.sanitizeValue(c.req.header("User-Agent"));

    //recaptcha
    const reRes = await verifyRecaptchaToken(recaptcha);
    if (reRes.isErr()) {
      console.error(reRes.error);
      posthog.captureException(reRes.error);
      return c.json(
        {
          error: "Internal server error",
          message: null,
          data: null,
        },
        500,
      );
    }
    if (reRes.value.score < 0.5 || !reRes.value.success) {
      return c.json(
        {
          error: "Bad request",
          message: "Recaptcha fail",
          data: null,
        },
        400,
      );
    }

    //check email unique
    const currentUser = await users.readByEmail(form.email);
    if (currentUser.isErr()) {
      console.error(currentUser.error);
      posthog.captureException(currentUser.error);
      return c.json(
        {
          error: "Internal server error",
          message: null,
          data: null,
        },
        500,
      );
    }

    //if not unique send password reset link and redirect
    if (currentUser.value) {
      const resetToken = await auth.generateAndSendPasswordResetToken(
        currentUser.value.id,
        currentUser.value.email,
      );
      if (resetToken.isErr()) {
        console.error(resetToken.error);
        posthog.captureException(resetToken.error);
        return c.json(
          {
            error: "Internal server error",
            message: null,
            data: null,
          },
          500,
        );
      }

      const sessionToken = await auth.createPasswordResetSession({
        uid: currentUser.value.id,
        userAgent,
        withCreds: false,
      });
      if (sessionToken.isErr()) {
        console.error(sessionToken.error);
        posthog.captureException(sessionToken.error);
        return c.json(
          {
            error: "Internal server error",
            message: null,
            data: null,
          },
          500,
        );
      }

      setCookie(c, "resetToken", sessionToken.value.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: siteConfig.auth.passwordResetTtl,
      });

      return c.redirect("/login/reset");
    }

    //create pending user, confirmation token, and session token
    let sessionToken = await auth.createPendingUserSession(form, userAgent);
    if (sessionToken.isErr()) {
      console.error(sessionToken.error);
      switch (sessionToken.error.type) {
        case "Invalid secret":
        case "Invalid claims object":
          console.error(sessionToken.error);
          posthog.captureException(sessionToken.error);
          return c.json(
            {
              error: "Bad request",
              message: "Malformed request",
              data: null,
            },
            400,
          );
        case "Resend error":
        case "Unknown error":
        default:
          console.error(sessionToken.error);
          posthog.captureException(sessionToken.error);
          return c.json(
            {
              error: "Internal server error",
              message: null,
              data: null,
            },
            500,
          );
      }
    }

    //Set session token in cookies
    setCookie(c, "confirmationSession", sessionToken.value, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: siteConfig.auth.passwordResetTtl,
    });

    //redirect to confirmation page
    //TODO: make middleware that redirects users to confirmation page if they have a valid confirmationSession token
    //TODO: make password reset confirmation page and password reset form
    return c.json(
      {
        error: null,
        message: "Success",
        data: null,
      },
      200,
    );
  },
);

export const GET = app.fetch;
export const POST = app.fetch;
export type HonoApp = typeof routes;
