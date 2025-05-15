import { Block } from "payload";
import { sectionField } from "@/lib/payload/fields";

export const SmallHero: Block = {
  slug: "SmallHero",
  interfaceName: "SmallHeroBlock",
  fields: [
    {
      name: "headline",
      label: "Headline",
      type: "text",
    },
    sectionField,
  ],
};
