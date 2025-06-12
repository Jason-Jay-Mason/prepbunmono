import "server-only";
import { siteConfig } from "@/config/site";
import { verifyRecaptchaToken } from "@/lib/recaptcha/server";
import { Auth } from "@/lib/service/auth";
import { Validate } from "@/lib/service/validate";
import {
  signupFormRequestSchema,
  verifyAccountRequestSchema,
} from "@/lib/zod/validators";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import posthog from "posthog-js";
import { Hono } from "hono";
import { UserModel } from "../db/models/users";
import { jwt } from "../jwt/jwt";
import { env } from "@/config/env";
import { PendingUserModel } from "../db/models/pendingUsers";
import { cookieKeys } from "./types";
import { nanoid } from "nanoid";

export const authRoutes = new Hono()
  .get("/verify", async (c) => {
    const confirmationSessionToken = getCookie(
      c,
      cookieKeys.confirmationSessionToken,
    );
    if (!confirmationSessionToken) {
      console.error("No confirmationSession token found in cookies");
      return c.json(
        {
          error: "Bad request",
          message: "Malformed request, please stop trying to hack us.",
          data: null,
        },
        400,
      );
    }
    const claims = jwt.parse(confirmationSessionToken, env.JWT_SECRET);
    if (claims.isErr()) {
      switch (claims.error.type) {
        case "Invalid claims object":
        case "Invalid JWT signature":
          console.error("Invlaid claims object, or invalid jwt signature.");
          return c.json(
            {
              error: "Bad request",
              message: "Malformed request, please stop trying to hack us.",
              data: null,
            },
            400,
          );
        default:
          posthog.captureException(claims.error);
          return c.json(
            {
              error: "Internal server error",
              message: "Please try again in a few hours.",
              data: null,
            },
            500,
          );
      }
    }
    const userAgent = Validate.sanitizeValue(c.req.header("User-Agent"));
    const pendingUser = await Auth.resetConfirmationToken(
      claims.value.uid,
      userAgent,
    );
    if (pendingUser.isErr()) {
      switch (pendingUser.error.type) {
        case "Invalid secret":
        case "Invalid claims object":
          return c.json(
            {
              error: "Bad request",
              message: "Malformed request, please stop trying to hack us.",
              data: null,
            },
            400,
          );
        default:
          posthog.captureException(pendingUser.error);
          return c.json(
            {
              error: "Internal server error",
              message: "",
              data: null,
            },
            500,
          );
      }
    }
    return c.json(
      {
        error: null,
        message: "Success",
        data: null,
      },
      200,
    );
  })
  .post(
    "/verify",
    zValidator("json", verifyAccountRequestSchema, (res, c) => {
      if (!res.success) {
        console.error("Zod error", res.error);
        return c.json(
          {
            error: "Bad request",
            message: "Malformed request, please stop trying to hack us.",
            data: null,
          },
          400,
        );
      }
    }),
    async (c) => {
      const { confirmationToken } = Validate.sanitizeJson(c.req.valid("json"));
      const confirmationSessionToken = getCookie(
        c,
        cookieKeys.confirmationSessionToken,
      );
      if (!confirmationSessionToken) {
        console.error("No confirmationSession token found in cookies");
        return c.json(
          {
            error: "Bad request",
            message: "Malformed request, please stop trying to hack us.",
            data: null,
          },
          400,
        );
      }
      const claims = jwt.parse(confirmationSessionToken, env.JWT_SECRET);
      if (claims.isErr()) {
        switch (claims.error.type) {
          case "Invalid claims object":
          case "Invalid JWT signature":
            console.error("Invlaid claims object, or invalid jwt signature");
            return c.json(
              {
                error: "Bad request",
                message: "Malformed request, please stop trying to hack us.",
                data: null,
              },
              400,
            );
          default:
            posthog.captureException(claims.error);
            return c.json(
              {
                error: "Internal server error",
                message: "Please try again in a few hours.",
                data: null,
              },
              500,
            );
        }
      }
      const pendingUser = await PendingUserModel.readPendingUserByUid(
        claims.value.uid,
      );
      if (pendingUser.isErr()) {
        switch (pendingUser.error.type) {
          case "No pending user found":
            //this should not happen so there is def a bug
            posthog.captureException(pendingUser.error);
            return c.json(
              {
                error: "pendingUser not found",
                message: "Please try signing up again at '/signup'",
                data: null,
              },
              500,
            );
          default:
            posthog.captureException(pendingUser.error);
            return c.json(
              {
                error: "Internal server error",
                message: "Please try again in a few hours.",
                data: null,
              },
              500,
            );
        }
      }

      const userAgent = Validate.sanitizeValue(c.req.header("User-Agent"));
      if (pendingUser.value.sessionToken !== confirmationSessionToken) {
        posthog.captureException(
          new Error("pendingUser had a session token that was not in the db"),
        );
        console.error(
          "sessionToken in cookie does not match the one in the db",
        );
        return c.json(
          {
            error: "Bad request",
            message: "Malformed request, please stop trying to hack us.",
            data: null,
          },
          400,
        );
      }
      if (pendingUser.value.confirmationToken !== confirmationToken) {
        return c.json(
          {
            error: "Invalid code",
            message:
              "You input the wrong code, please double check your email and try again.",
            data: null,
          },
          400,
        );
      }

      const now = new Date();
      //create new user and give the client a user session

      const user = await UserModel.createOne({
        id: nanoid(8),
        email: pendingUser.value.email,
        password: pendingUser.value.password,
        emailConfirmed: true,

        // Password reset
        passwordResetToken: null,
        passwordResetTokenExpires: null,

        loginAttempts: 0,
        lastLoginAttempt: null,

        createdAt: now,
        updatedAt: now,
      });

      if (user.isErr()) {
        console.error(user.error);
        posthog.captureException(user.error);
        return c.json(
          {
            error: "Internal server error",
            message: "Please try again in a few hours.",
            data: null,
          },
          500,
        );
      }

      const session = await Auth.createUserSession(
        {
          uid: user.value.id,
          userAgent,
          withCreds: true,
        },
        "student",
      );
      if (session.isErr()) {
        switch (session.error.type) {
          case "Invalid secret":
            return c.json(
              {
                error: "Bad request",
                message: "Malformed request, please stop trying to hack us.",
                data: null,
              },
              400,
            );
          default:
            console.error(session.error);
            posthog.captureException(session.error);
            return c.json(
              {
                error: "Internal server error",
                message: "Please try again in a few hours.",
                data: null,
              },
              500,
            );
        }
      }

      const found = deleteCookie(c, cookieKeys.confirmationSessionToken);
      if (!found) {
        console.error("Deleting access cookie din werk");
      }

      setCookie(c, cookieKeys.accessToken, session.value.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: siteConfig.auth.accessTtl / 1000,
      });

      setCookie(c, cookieKeys.refreshToken, session.value.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: siteConfig.auth.refreshTtl / 1000,
      });

      PendingUserModel.deleteByUid(claims.value.uid).catch((e) => {
        console.error(e);
        posthog.captureException(e);
      });

      return c.json(
        {
          error: null,
          message: "User created",
          data: null,
        },
        200,
      );
    },
  )
  .post(
    "/signup",
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
            message: "Please try again in a few hours.",
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
      const currentUser = await UserModel.readByEmail(form.email);
      if (currentUser.isErr()) {
        console.error(currentUser.error);
        posthog.captureException(currentUser.error);
        return c.json(
          {
            error: "Internal server error",
            message: "Please try again in a few hours.",
            data: null,
          },
          500,
        );
      }

      //if not unique send password reset link and redirect
      if (currentUser.value) {
        const resetToken = await Auth.generateAndSendPasswordResetToken(
          currentUser.value.id,
          currentUser.value.email,
        );
        if (resetToken.isErr()) {
          console.error(resetToken.error);
          posthog.captureException(resetToken.error);
          return c.json(
            {
              error: "Internal server error",
              message: "Please try again in a few hours.",
              data: null,
            },
            500,
          );
        }

        const sessionToken = await Auth.createPasswordResetSession({
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
              message: "Please try again in a few hours.",
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

        return c.json(
          {
            error: "Existing account.",
            message: "Check you email for password reset code.",
            data: null,
          },
          200,
        );
      }

      //create pending user, confirmation token, and session token
      let tokens = await Auth.createPendingUserSession(form, userAgent);
      if (tokens.isErr()) {
        switch (tokens.error.type) {
          case "Invalid secret":
          case "Invalid claims object":
            console.error(tokens.error);
            posthog.captureException(tokens.error);
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
            console.error(tokens.error);
            posthog.captureException(tokens.error);
            return c.json(
              {
                error: "Internal server error",
                message: "Please try again in a few hours.",
                data: null,
              },
              500,
            );
        }
      }

      const resendRes = await Auth.emailConfirmationCode(
        form.email,
        tokens.value.confirmationToken,
      );
      if (resendRes.isErr()) {
        console.error(resendRes.error);
        posthog.captureException(resendRes.error);
        return c.json(
          {
            error: "Internal server error",
            message: "Please try again in a few hours.",
            data: null,
          },
          500,
        );
      }

      setCookie(
        c,
        cookieKeys.confirmationSessionToken,
        tokens.value.sessionToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
          //setCookie expects seconds
          maxAge: siteConfig.auth.passwordResetTtl / 1000,
        },
      );

      //redirect to confirmation page
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
