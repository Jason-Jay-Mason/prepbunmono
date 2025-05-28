export type Secret = string;
export interface Claims {
  uid: string;
  userAgent: string;
  withCreds: boolean;
}

export interface ParsedClaims extends Claims {
  iat: number;
}

export type Token = string;
