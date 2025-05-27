import { z } from "zod";

export const VerifyClaimsSchema = z.object({
  uid: z.string(),
  userAgent: z.string(),
  withCreds: z.boolean(),
  iat: z.number(),
});
