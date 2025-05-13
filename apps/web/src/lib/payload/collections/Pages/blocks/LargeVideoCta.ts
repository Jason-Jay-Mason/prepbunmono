import { Block } from "payload";
import { newCtaField, sectionField } from "@/lib/payload/fields";

export const LargeVideoCta: Block = {
  slug: "LargeVideoCta",
  interfaceName: "LargeVideoCtaBlock",
  fields: [
    {
      name: "headline",
      label: "Headline",
      type: "text",
    },
    {
      name: "blurb",
      label: "Blurb",
      type: "text",
    },
    {
      name: "bgVideoSource",
      label: "Background Video Source",
      type: "text",
    },
    newCtaField("cta", "CTA"),
    sectionField,
  ],
};
