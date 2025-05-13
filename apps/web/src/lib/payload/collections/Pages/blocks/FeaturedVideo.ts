import { Block } from "payload";
import { newImgField, sectionField } from "@/lib/payload/fields";

export const FeaturedVideo: Block = {
  slug: "FeaturedVideo",
  interfaceName: "FeaturedVideoBlock",
  fields: [
    newImgField("logo", "Logo", false),
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
      name: "videoSrc",
      label: "Video Source",
      type: "text",
    },
    {
      name: "videoPreviewSrc",
      label: "Video Preview Source",
      type: "text",
    },
    sectionField,
  ],
};
