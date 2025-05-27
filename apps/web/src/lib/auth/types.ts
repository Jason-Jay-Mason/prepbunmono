export type Secret = string;
export interface Claims {
  uid: string;
  userAgent: string;
  withCreds: boolean;
}

export interface ParsedClaims extends Claims {
  iat: number;
}

export type ParseJwtError =
  | "Unknown JWT parse error"
  | "Invalid JWT signature"
  | "JWT malformed"
  | "Invalid claims object";

export type Token = string;
