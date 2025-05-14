import { Block } from "payload";
import { newCtaField, newImgField, sectionField } from "@/lib/payload/fields";

export const PreFooterCta: Block = {
  slug: "PreFooterCta",
  interfaceName: "PreFooterCtaBlock",
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
    newImgField("backgroundImg", "Background Image", true),
    newCtaField("cta", "CTA"),
    sectionField,
  ],
};
