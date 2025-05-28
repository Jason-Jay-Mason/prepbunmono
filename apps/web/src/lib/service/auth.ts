import { err, ok } from "neverthrow";
import { AsyncErr } from "../error/types";
import {
  CreateUserErr,
  GetUserWithCredsErr,
  SetLoginAtteptsErr,
  users,
} from "../db/models/users";
import { GenerateClaimsError, jwt } from "../jwt/jwt";
import { siteConfig } from "../../config/site";
import { env } from "../../config/env";
import { CreateSessionErr, sessions } from "../db/models/sessions";
import bcrypt from "bcrypt";
import { getErr } from "../error/utils";

type Creds = {
  email: string;
  password: string;
};

type SignInSuccess = {
  accessToken: string;
  refreshToken: string;
  accessTtlMs: number;
  refreshTtlMs: number;
};

async function updatePasswordWithResetToken() {}

async function createResetToken() {}

async function sendConfirmationToken() {}

async function createConfirmationToken() {}

async function createSessionWithConfirmationToken() {}

type CreateUserWithCredsErr = CreateUserErr;
async function createUserWithCreds(
  c: Creds,
): AsyncErr<boolean, CreateUserWithCredsErr> {
  try {
    const hashed = await bcrypt.hash(c.password, siteConfig.auth.saltRounds);
    const now = new Date().toISOString();
    const user = await users.createUser({
      id: crypto.randomUUID(),
      email: c.email,
      password: hashed,
      loginAttempts: 0,
      lastLoginAttempt: now,
      createdAt: now,
      updatedAt: now,
    });
    if (user.isErr()) {
      return err(user.error);
    }
    return ok(true);
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      cause: e,
      context: e.stack,
    });
  }
}

type CreateSessionWithCredsErr =
  | "Invalid password"
  | "Unexpected token type"
  | "Invalid password"
  | "Login attempts exceeded"
  | "Email needs confirmation"
  | CreateSessionErr
  | GetUserWithCredsErr
  | SetLoginAtteptsErr
  | GenerateClaimsError;
async function createSessionWithCreds(
  c: Creds,
  userAgent: string,
): AsyncErr<SignInSuccess, CreateSessionWithCredsErr> {
  try {
    //Get user
    const user = await users.getUserByEmail(c.email);
    if (user.isErr()) {
      return err(user.error);
    }

    if (!user.value.emailConfirmed) {
      return err({
        type: "Email needs confirmation",
        message: "The email for this user needs to be confirmed",
      });
    }

    //Check login attempts
    if (user.value.loginAttempts >= siteConfig.auth.maxLoginAttempts) {
      return err({
        type: "Login attempts exceeded",
        message: "Login attempts exceeded, please reset your password.",
      });
    }

    //Check password
    const passwordOk = await bcrypt.compare(c.password, user.value.password);
    if (!passwordOk) {
      const setLoginOk = await users.setLoginAttempts(
        user.value.id,
        user.value.loginAttempts + 1,
      );
      if (setLoginOk.isErr()) {
        return err(setLoginOk.error);
      }
      return err({
        type: "Invalid password",
        message: "Invalid password for user",
      });
    }

    //Generate tokens
    const accessToken = jwt.generate(env.JWT_SECRET, {
      uid: user.value.id,
      userAgent,
      withCreds: true,
    });
    if (accessToken.isErr()) {
      return err(accessToken.error);
    }
    const refreshToken = jwt.generate(env.JWT_SECRET, {
      uid: user.value.id,
      userAgent,
      withCreds: true,
    });
    if (refreshToken.isErr()) {
      return err(refreshToken.error);
    }

    //Create session in db
    let createSessionOk = await sessions.createSession({
      uid: user.value.id,
      refreshToken: refreshToken.value,
      expires: new Date(Date.now() + siteConfig.auth.refreshTtl).toISOString(),
    });

    if (createSessionOk.isErr()) {
      return err(createSessionOk.error);
    }

    return ok({
      accessToken: accessToken.value,
      accessTtlMs: siteConfig.auth.accessTtl,
      refreshToken: refreshToken.value,
      refreshTtlMs: siteConfig.auth.refreshTtl,
    });
  } catch (unsafe) {
    const e = getErr(unsafe);
    return err({
      type: "Unknown error",
      message:
        "Unknown error occured in createSessionWithCreds, it would be good to take note of this error and hanlde it in the try block with neverthrow",
      cause: e,
      context: e.stack,
    });
  }
}

export const Auth = {
  updatePasswordWithResetToken,
  createResetToken,
  createConfirmationToken,
  sendConfirmationToken,
  createSessionWithConfirmationToken,
  createSessionWithCreds,
  createUserWithCreds,
};
