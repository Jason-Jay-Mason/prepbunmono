import { Block } from "payload";
import { sectionField } from "@/lib/payload/fields";

export const StatGrid: Block = {
  slug: "StatGrid",
  interfaceName: "StatGridBlock",
  fields: [
    {
      name: "stats",
      label: "Stats",
      type: "array",
      required: true,
      fields: [
        {
          name: "number",
          label: "Number",
          type: "number",
          required: true,
        },
        {
          name: "prefix",
          label: "Prefix",
          type: "text",
        },
        {
          name: "suffix",
          label: "Suffix",
          type: "text",
        },
        {
          name: "blurb",
          label: "Blurb",
          type: "text",
        },
      ],
    },
    sectionField,
  ],
};
