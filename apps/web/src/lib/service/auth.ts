import "server-only";
import { err, ok } from "neverthrow";
import { AsyncResult, InferAsyncErr } from "../error/types";
import { siteConfig } from "@/config/site";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import { ConfirmationCodeEmail } from "../resend/emails/ConfirmationCode";

import { env } from "@/config/env";
import { jwt } from "../jwt/jwt";
import { Claims } from "../jwt/types";
import { SignUpFormFields } from "../zod/validators";
import { nanoid } from "nanoid";
import { UserModel } from "../db/models/users";
import { SessionModel, SessionType } from "../db/models/sessions";
import { InsertPendingUser, PendingUserModel } from "../db/models/pendingUsers";
import { getErr } from "../error/utils";
import { cookies, headers } from "next/headers";
import { cookieKeys } from "../api/types";
const resend = new Resend(env.RESEND);

type UserSession = {
  accessToken: string;
  refreshToken: string;
  ttl: Date;
};

type AuthStatus = {
  authed: boolean;
  type: string;
  uid: string;
  withCreds: string;
};

//TODO: check to make sure encoding the session type into the jwt secret is a good idea
//TODO: create the middleware for authentication on layouts
export namespace Auth {
  ///
  // export namespace next {
  //   async function _getAuth(): AsyncResult<AuthStatus | null, never> {
  //     const c = await cookies();
  //     const h = await headers();
  //     const accessToken = c.get(cookieKeys.accessToken)?.value;
  //     const refreshToken = c.get(cookieKeys.refreshToken)?.value;
  //     h.get("User-Agent");
  //     if (!refreshToken) {
  //       c.delete(cookieKeys.accessToken);
  //       c.delete(cookieKeys.refreshToken);
  //       return ok(null);
  //     }
  //     if (accessToken) {
  //       const accessClaims = jwt.parse(accessToken, env.JWT_SECRET);
  //       if (accessClaims.isErr()) {
  //         c.delete(cookieKeys.accessToken);
  //         c.delete(cookieKeys.refreshToken);
  //         return ok(null);
  //       }
  //     }
  //   }
  // }

  export function createConfirmationToken(): string {
    let token = crypto.randomUUID().toUpperCase().slice(0, 6);
    return token;
  }

  export async function comparePassword(
    pw: string,
    encryptedPw: string,
  ): AsyncResult<boolean, never> {
    try {
      const pwOk = await bcrypt.compare(pw, encryptedPw);
      if (!pwOk) {
        return ok(false);
      }
      return ok(true);
    } catch (unsafe) {
      const e = getErr(unsafe);
      return err({
        type: "Unknown error",
        cause: e,
        stack: e.stack,
      });
    }
  }

  export async function getSessionWithRefresh(
    refreshToken: string,
    paresedClaims: Claims,
  ): AsyncResult<
    UserSession,
    | InferAsyncErr<typeof SessionModel.getSessionByRefresh>
    | InferAsyncErr<typeof jwt.generate>
  > {
    const session = await SessionModel.getSessionByRefresh(refreshToken);
    if (session.isErr()) {
      return err(session.error);
    }
    const accessToken = jwt.generate(env.JWT_SECRET, {
      uid: paresedClaims.uid,
      userAgent: paresedClaims.userAgent,
      withCreds: false,
      sessionType: session.value.type,
    });
    if (accessToken.isErr()) {
      return err(accessToken.error);
    }
    return ok({
      accessToken: accessToken.value,
      refreshToken,
      ttl: new Date(Date.now() + siteConfig.auth.accessTtl),
    });
  }

  export async function resetConfirmationToken(
    uid: string,
    userAgent: string,
  ): AsyncResult<
    InsertPendingUser,
    | InferAsyncErr<typeof jwt.generate>
    | InferAsyncErr<
        typeof PendingUserModel.updateConfirmationAndSessionTokenByUid
      >
  > {
    const sessionToken = jwt.generate(env.JWT_SECRET, {
      uid,
      userAgent: userAgent,
      withCreds: false,
      sessionType: "confirmation",
    });
    if (sessionToken.isErr()) {
      return err(sessionToken.error);
    }
    const pendingUser =
      await PendingUserModel.updateConfirmationAndSessionTokenByUid(
        uid,
        Auth.createConfirmationToken(),
        sessionToken.value,
      );
    if (pendingUser.isErr()) {
      return err(pendingUser.error);
    }
    return ok(pendingUser.value);
  }

  export async function createUserSession(
    c: Claims,
  ): AsyncResult<
    UserSession,
    | InferAsyncErr<typeof jwt.generate>
    | InferAsyncErr<typeof SessionModel.createOne>
  > {
    const refreshToken = jwt.generate(env.JWT_SECRET, c);
    if (refreshToken.isErr()) {
      return err(refreshToken.error);
    }

    const sessionRes = await SessionModel.createOne({
      uid: c.uid,
      token: refreshToken.value,
      type: c.sessionType,
      expires: new Date(Date.now() + siteConfig.auth.refreshTtl),
    });

    if (sessionRes.isErr()) {
      return err(sessionRes.error);
    }

    const accessToken = jwt.generate(env.JWT_SECRET, c);
    if (accessToken.isErr()) {
      return err(accessToken.error);
    }

    return ok({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      ttl: new Date(Date.now() + siteConfig.auth.accessTtl),
    });
  }

  export async function generateAndSendPasswordResetToken(
    uid: string,
    userEmail: string,
  ): AsyncResult<
    string,
    "Resend error" | InferAsyncErr<typeof UserModel.updatePasswordResetToken>
  > {
    const token = createConfirmationToken();
    const expires = new Date(Date.now() + siteConfig.auth.passwordResetTtl);
    const tokenOk = await UserModel.updatePasswordResetToken(
      uid,
      token,
      expires,
    );
    if (tokenOk.isErr()) {
      return err(tokenOk.error);
    }
    const res = await resend.emails.send({
      from: "Prepbun <info@prepbun.com>",
      to: [userEmail],
      subject: `Reset password ${siteConfig.seo.siteName} account`,
      react: await ConfirmationCodeEmail({ code: token }),
    });
    if (res.error) {
      return err({
        type: "Resend error",
        cause: res.error,
        context: new Error().stack,
      });
    }
    return ok(token);
  }

  type PasswordResetSession = {
    token: string;
    ttl: Date;
  };
  export async function createPasswordResetSession(
    c: Claims,
  ): AsyncResult<
    PasswordResetSession,
    | InferAsyncErr<typeof jwt.generate>
    | InferAsyncErr<typeof SessionModel.createOne>
  > {
    const token = jwt.generate(env.JWT_SECRET, c);
    if (token.isErr()) {
      return err(token.error);
    }
    const expires = new Date(Date.now() + siteConfig.auth.passwordResetTtl);
    const sessionOk = await SessionModel.createOne({
      uid: c.uid,
      token: token.value,
      expires: expires,
      type: "passwordReset",
    });
    if (sessionOk.isErr()) {
      return err(sessionOk.error);
    }
    return ok({
      token: token.value,
      ttl: expires,
    });
  }

  export async function emailConfirmationCode(
    userEmail: string,
    confirmationToken: string,
  ): AsyncResult<boolean, "Resend error"> {
    const res = await resend.emails.send({
      from: "prepbun.com <noreply@prepbun.com>",
      to: [
        process.env.NODE_ENV === "development"
          ? "jasonjaymason@gmail.com"
          : userEmail,
      ],
      subject: `Confirm your ${siteConfig.seo.siteName} account`,
      react: await ConfirmationCodeEmail({ code: confirmationToken }),
    });
    if (res.error) {
      return err({
        type: "Resend error",
        cause: res.error,
        context: new Error().stack,
      });
    }
    return ok(true);
  }

  export type CreatePendingUserSessionRes = {
    confirmationToken: string;
    sessionToken: string;
  };
  export async function createPendingUserSession(
    f: SignUpFormFields,
    userAgent: string,
  ): AsyncResult<
    CreatePendingUserSessionRes,
    | InferAsyncErr<typeof jwt.generate>
    | InferAsyncErr<typeof PendingUserModel.createOne>
    | InferAsyncErr<typeof PendingUserModel.readByEmail>
    | "Resend error"
  > {
    const confirmationToken = createConfirmationToken();

    //Fist handle case where the user already exists as a pending user
    let existingPendingUser = await PendingUserModel.readByEmail(f.email);
    if (existingPendingUser.isErr()) {
      return err(existingPendingUser.error);
    }
    if (existingPendingUser.value) {
      let sessionToken = jwt.generate(env.JWT_SECRET, {
        uid: existingPendingUser.value.id,
        userAgent,
        withCreds: true,
        sessionType: "confirmation",
      });
      if (sessionToken.isErr()) {
        return err(sessionToken.error);
      }
      let res =
        await PendingUserModel.updateConfirmationAndSessionTokensByEmail(
          confirmationToken,
          sessionToken.value,
          f.email,
        );
      if (res.isErr()) {
        return err(res.error);
      }
      return ok({
        confirmationToken,
        sessionToken: sessionToken.value,
      });
    }

    //Create pending user
    const uid = nanoid(8);
    let sessionToken = jwt.generate(env.JWT_SECRET, {
      uid,
      withCreds: true,
      userAgent,
      sessionType: "confirmation",
    });
    if (sessionToken.isErr()) {
      return err(sessionToken.error);
    }
    const hashed = await bcrypt.hash(f.password, siteConfig.auth.saltRounds);
    let pendingUser = await PendingUserModel.createOne({
      id: uid,
      email: f.email,
      password: hashed,
      sessionToken: sessionToken.value,
      confirmationToken,
      confirmationTokenExpires: new Date(
        Date.now() + siteConfig.auth.passwordResetTtl,
      ),
      expiresAt: new Date(Date.now() + siteConfig.auth.pendingUserTtl),
      createdAt: new Date(),
    });
    if (pendingUser.isErr()) {
      return err(pendingUser.error);
    }

    return ok({
      confirmationToken,
      sessionToken: sessionToken.value,
    });
  }
}
