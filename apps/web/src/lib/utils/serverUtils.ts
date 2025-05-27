import { getErr, ServerErr } from "../error/utils";
import { err, ok, Result } from "neverthrow";

export type SafeFetchErrType = "Unknown fetch error";

interface SafeFetchResponse<T> {
  response: Response;
  data: T;
}
export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Result<SafeFetchResponse<T>, ServerErr<SafeFetchErrType>>> {
  let res;
  try {
    res = await fetch(input, init);
    const data: T = await res.json();
    return ok({
      response: res,
      data: data,
    });
  } catch (e) {
    return err({
      type: "Unknown fetch error",
      message: `There was an problem fetching recource at ${input}`,
      cause: getErr(e),
    });
  }
}
