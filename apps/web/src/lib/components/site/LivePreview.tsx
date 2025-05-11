"use client";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { Page, Page as PageType } from "@/payload-types";
import { PageSecitons } from "./PageSections";
import { env } from "@/config/env";

export const LivePreview: React.FC<Page> = (page) => {
  const { data } = useLivePreview<PageType>({
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
