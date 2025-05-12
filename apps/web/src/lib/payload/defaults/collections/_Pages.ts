import type { Block, CollectionConfig } from "payload";
import type { FieldHook } from "payload";
import { revalidatePath } from "next/cache";
import type { Access } from "payload";
import { env } from "@/config/env";
import { loggedIn } from "../../access/functions";
import { seoField } from "../../fields";

export function DefaultPageCollection(blocks: Block[]): CollectionConfig {
  return {
    slug: "pages",
    hooks: {
      afterChange: [
        (e) => {
          const p = e.doc;

          if (p._status === "published") {
            const slug = p.slug === "home" ? "/" : `/${p.slug}`;
            revalidatePath(slug);
          }
        },
      ],
    },
    access: {
      create: loggedIn,
      delete: loggedIn,
      read: handleRead,
      update: loggedIn,
    },
    admin: {
      defaultColumns: ["title", "slug", "updatedAt"],
      livePreview: {
        url: ({ data }) => {
          const isHomePage = data.slug === "home";
          const url = `${env.NEXT_PUBLIC_CLIENT_URL}/${!isHomePage ? `/${data.slug}` : ""}`;
          return url;
        },
      },
      useAsTitle: "title",
    },
    versions: {
      drafts: {
        autosave: {
          interval: 375,
        },
      },
    },
    fields: [
      {
        name: "title",
        type: "text",
        required: true,
      },
      {
        name: "absoluteNav",
        type: "checkbox",
        label: "Absolute Nav",
      },
      {
        name: "slug",
        type: "text",
        admin: {
          position: "sidebar",
        },
        hooks: {
          beforeValidate: [formatSlug("title")],
        },
        index: true,
        label: "Slug",
      },
      {
        name: "sections",
        label: "Sections",
        type: "blocks",
        blocks,
      },
      seoField,
    ],
  };
}

const handleRead: Access = ({ req }) => {
  if (req.user) {
    return true;
  }
  return {
    _status: {
      equals: "published",
    },
  };
};

const format = (val: string): string =>
  val
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();

const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === "string") {
      return format(value);
    }

    if (operation === "create") {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback];

      if (fallbackData && typeof fallbackData === "string") {
        return format(fallbackData);
      }
    }

    return value;
  };
