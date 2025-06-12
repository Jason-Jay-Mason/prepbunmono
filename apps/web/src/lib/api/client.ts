import { hc } from "hono/client";
import { HonoApp } from "@/app/api/v1/[[...route]]/route";

export const rpc = hc<HonoApp>("/");
