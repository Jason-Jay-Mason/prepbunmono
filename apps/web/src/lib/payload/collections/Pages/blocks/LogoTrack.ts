import { Block } from "payload";
import { newImgField, sectionField } from "@/lib/payload/fields";

export const LogoTrack: Block = {
  slug: "LogoTrack",
  interfaceName: "LogoTrackBlock",
  fields: [
    {
      name: "blurb",
      label: "Blurb",
      type: "text",
    },
    {
      name: "logos",
      label: "Logos",
      type: "array",
      fields: [newImgField("src", "Source", true)],
    },
    sectionField,
  ],
};
