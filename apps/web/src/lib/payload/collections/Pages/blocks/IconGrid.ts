import { Block } from "payload";
import {
  newImgField,
  sectionField,
  standardHeadline,
} from "@/lib/payload/fields";

export const IconGrid: Block = {
  slug: "IconGrid",
  interfaceName: "IconGridBlock",
  fields: [
    standardHeadline,
    {
      name: "gridCells",
      label: "Grid Cells",
      type: "array",
      required: true,
      fields: [
        newImgField("icon", "Icon", true),
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
          required: true,
        },
      ],
    },
    sectionField,
  ],
};
