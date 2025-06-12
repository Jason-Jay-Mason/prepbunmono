import { AsyncResult } from "../error/types";
import { getErr } from "../error/utils";
import { err, ok } from "neverthrow";

export type SafeFetchErr = "Unknown fetch error";

interface SafeFetchResponse<T> {
  response: Response;
  data: T;
}

export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): AsyncResult<SafeFetchResponse<T>, SafeFetchErr> {
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
