import { hc } from "hono/client";
import { env } from "@/config/env";
import { HonoApp } from "../api/v1/[[...route]]/route";

const Page: React.FC<any> = async () => {
  const client = hc<HonoApp>(env.NEXT_PUBLIC_CLIENT_URL);
  const res = await client.api.v1.hello.$get({
    query: { name: "Under construction" },
  });
  const data = await res.json();
  return <div>{data.message}</div>;
};

export default Page;
