import { newCtaField, sectionField } from "@/lib/payload/fields";
import { Block } from "payload";

export const Hero: Block = {
  slug: "Hero",
  interfaceName: "HeroBlock",
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
    sectionField,
    newCtaField("primaryCta", "Primary Call to Action"),
    newCtaField("secondaryCta", "Secondary Call to Action"),
  ],
};
