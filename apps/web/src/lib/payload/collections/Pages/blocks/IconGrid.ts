import { Block } from "payload";
import { newImgField, sectionField } from "@/lib/payload/fields";

export const IconGrid: Block = {
  slug: "IconGrid",
  interfaceName: "IconGridBlock",
  fields: [
    {
      name: "subHeadline",
      label: "Sub Headline",
      type: "text",
      required: true,
    },
    {
      name: "headline",
      label: "Headline",
      type: "text",
      required: true,
    },
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
