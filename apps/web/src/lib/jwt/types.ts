import { SessionType } from "../db/models/sessions";

export type Secret = string;
export interface Claims {
  uid: string;
  userAgent: string;
  withCreds: boolean;
  sessionType: SessionType;
}

export interface ParsedClaims extends Claims {
  iat: number;
}

export type Token = string;
