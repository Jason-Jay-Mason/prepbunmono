import { Block } from "payload";
import { newCtaField, sectionField } from "@/lib/payload/fields";

export const HeroVideoBox: Block = {
  slug: "HeroVideoBox",
  interfaceName: "HeroVideoBoxBlock",
  fields: [
    {
      name: "headline",
      label: "Headline",
      type: "text",
      required: true,
    },
    {
      name: "blurb",
      label: "Blurb",
      type: "text",
      required: false,
    },
    {
      name: "bgVideoSrc",
      label: "Background Video Source",
      type: "text",
      required: true,
    },
    newCtaField("primaryCta", "Primary Call to Action"),
    {
      name: "salesVideoCtaInnerText",
      label: "Sales Video CTA Inner Text",
      type: "text",
    },
    {
      name: "salesVideoSrc",
      label: "Video Source",
      type: "text",
    },
    sectionField,
  ],
};
