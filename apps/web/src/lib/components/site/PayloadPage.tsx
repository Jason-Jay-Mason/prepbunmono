"use server";
import { Page } from "@/payload-types";
import { LivePreview } from "./LivePreview";
import { PageSecitons } from "./PageSections";

export const PayloadPage: React.FC<{ page: Page; isDraft: boolean }> = async ({
  page,
  isDraft,
}) => {
  return (
    <>{isDraft ? <LivePreview {...page} /> : <PageSecitons {...page} />}</>
  );
};
