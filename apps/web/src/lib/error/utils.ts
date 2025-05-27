import { ZodError } from "zod";

export function getErr(value: any): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );
  return error;
}

//neverthrow error types
export type ServerErr<T extends string> = {
  type: T;
  message?: string;
  cause?: ServerErr<any> | ZodError | Error;
  context?: any;
};
