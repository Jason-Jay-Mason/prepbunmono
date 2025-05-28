import { z } from "zod";

export const praseClaimsSchema = z.object({
  uid: z.string(),
  userAgent: z.string(),
  withCreds: z.boolean(),
  iat: z.number(),
});

export const generateClaimsSchema = z.object({
  uid: z.string(),
  userAgent: z.string(),
  withCreds: z.boolean(),
});
