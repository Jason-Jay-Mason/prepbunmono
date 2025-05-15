import { Block } from "payload";
import { sectionField, standardHeadline } from "@/lib/payload/fields";

export const FeaturedRichText: Block = {
  slug: "FeaturedRichText",
  interfaceName: "FeaturedRichTextBlock",
  fields: [
    standardHeadline,
    {
      name: "body",
      label: "Body",
      type: "richText",
      required: true,
    },
    sectionField,
  ],
};
