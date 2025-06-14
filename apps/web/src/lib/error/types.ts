import { Result } from "neverthrow";
import { ZodError } from "zod";

//neverthrow error types
export type ServerErr<T extends string> = {
  type: T;
  message?: string;
  cause?: ServerErr<any> | ZodError | Error;
  context?: any;
};

export type AsyncResult<T, S extends string> = Promise<
  Result<T, ServerErr<S | "Unknown error">>
>;
export type SyncResult<T, S extends string> = Result<
  T,
  ServerErr<S | "Unknown error">
>;

export type InferAsyncErr<T> = T extends (
  ...args: any[]
) => Promise<Result<any, infer E>>
  ? E extends { type: infer ErrorType }
    ? ErrorType
    : never
  : T extends (...args: any[]) => Result<any, infer E>
    ? E extends { type: infer ErrorType }
      ? ErrorType
      : never
    : never;

export class ClientError extends Error {
  constructor(message: string, options?: { description?: string }) {
    super(message);
    this.name = "ClientError";
    if (options?.description) {
      this.description = options.description;
    }
  }
  description?: string;
}
