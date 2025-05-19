"use client";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { Page } from "@/payload-types";
import { PageSecitons } from "./PageSections";
import { env } from "@/config/env";

export const LivePreview: React.FC<Page> = (page) => {
  const { data } = useLivePreview<any>({
    initialData: page,
    serverURL: env.NEXT_PUBLIC_CLIENT_URL,
    depth: 2,
  });

  return (
    <>
      <PageSecitons {...data} />
    </>
  );
};
