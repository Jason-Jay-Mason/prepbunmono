import type { CollectionConfig } from "payload";
import { draftMode } from "next/headers";

async function enableDraft() {
  const draft = await draftMode();
  if (!draft.isEnabled) draft.enable();
  console.log(`Draft Mode: ${!draft.isEnabled}`);
}

async function disableDraft() {
  const draft = await draftMode();
  draft.disable();
  console.log(`Draft Mode: ${!draft.isEnabled}`);
}

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  hooks: {
    afterLogin: [() => enableDraft()],
    afterLogout: [() => disableDraft()],
    afterMe: [
      (e) => {
        if (e.req.user) enableDraft();
      },
    ],
  },
  auth: true,
  fields: [],
};
