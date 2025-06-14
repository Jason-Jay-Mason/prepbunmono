import { z } from "zod";
import { sessionTypesSchema } from "../db/models/sessions";

export const praseClaimsSchema = z.object({
  uid: z.string(),
  userAgent: z.string(),
  withCreds: z.boolean(),
  sessionType: sessionTypesSchema,
  iat: z.number(),
});

export const generateClaimsSchema = z.object({
  uid: z.string(),
  userAgent: z.string(),
  withCreds: z.boolean(),
});
