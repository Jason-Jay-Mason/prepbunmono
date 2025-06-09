import { err, ok } from "neverthrow";
import { AsyncErr } from "../error/types";
import { users } from "../db/models/users";
import { siteConfig } from "@/config/site";
import { Resend } from "resend";
import bcrypt from "bcrypt";
import { ConfirmationCodeEmail } from "../resend/emails/ConfirmationCode";

import { env } from "@/config/env";
import { GenerateClaimsError, jwt } from "../jwt/jwt";
import { Claims } from "../jwt/types";
import { CreateSessionErr, sessions } from "../db/models/sessions";
import { CreatePendingUserErr, pendingUsers } from "../db/models/pendingUsers";
import { SignUpFormFields } from "../zod/validators";
import { nanoid } from "nanoid";
const resend = new Resend(env.RESEND);

function createConfirmationToken(): string {
  let token = crypto.randomUUID().toUpperCase().slice(0, 6);
  return token;
}

type GenerateAndSendPasswordResetErr = "Resend error";
async function generateAndSendPasswordResetToken(
  uid: string,
  userEmail: string,
): AsyncErr<string, GenerateAndSendPasswordResetErr> {
  const token = createConfirmationToken();
  const expires = new Date(Date.now() + siteConfig.auth.passwordResetTtl);
  const tokenOk = await users.updatePasswordResetToken(uid, token, expires);
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

type CreatePasswordResetSessionErr = GenerateClaimsError | CreateSessionErr;
type PasswordResetSession = {
  token: string;
  ttl: Date;
};
async function createPasswordResetSession(
  c: Claims,
): AsyncErr<PasswordResetSession, CreatePasswordResetSessionErr> {
  const token = jwt.generate(env.JWT_SECRET, c);
  if (token.isErr()) {
    return err(token.error);
  }
  const expires = new Date(Date.now() + siteConfig.auth.passwordResetTtl);
  const sessionOk = await sessions.createSession({
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

type CreatePendingUserSessionErr =
  | GenerateClaimsError
  | CreatePendingUserErr
  | "Resend error";
async function createPendingUserSession(
  f: SignUpFormFields,
  userAgent: string,
): AsyncErr<string, CreatePendingUserSessionErr> {
  const confirmationToken = createConfirmationToken();
  const uid = nanoid(8);
  let sessionToken = jwt.generate(env.JWT_SECRET, {
    uid,
    withCreds: true,
    userAgent,
  });
  if (sessionToken.isErr()) {
    return err(sessionToken.error);
  }
  const hashed = await bcrypt.hash(f.password, siteConfig.auth.saltRounds);
  let pendingUser = await pendingUsers.createOne({
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
    switch (pendingUser.error.type) {
      case "Pending email taken":
        const currentPendingUser =
          await pendingUsers.updateConfirmationAndSessionTokensByEmail(
            confirmationToken,
            sessionToken.value,
            f.email,
          );
        if (currentPendingUser.isErr()) {
          return err(currentPendingUser.error);
        }
        pendingUser = currentPendingUser;
        break;
      default:
        return err(pendingUser.error);
    }
  }
  const res = await resend.emails.send({
    from: "info <info@prepbun.com>",
    to: [
      process.env.NODE_ENV === "development"
        ? "jasonjaymason@gmail.com"
        : f.email,
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
  return ok(pendingUser.value.sessionToken);
}

export const auth = {
  createPendingUserSession,
  generateAndSendPasswordResetToken,
  createPasswordResetSession,
};
