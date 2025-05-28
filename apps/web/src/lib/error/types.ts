import { Result } from "neverthrow";
import { ZodError } from "zod";

//neverthrow error types
export type ServerErr<T extends string> = {
  type: T;
  message?: string;
  cause?: ServerErr<any> | ZodError | Error;
  context?: any;
};

export type AsyncErr<T, S extends string> = Promise<
  Result<T, ServerErr<S | "Unknown error">>
>;
