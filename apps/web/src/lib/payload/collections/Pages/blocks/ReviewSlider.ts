import { Block } from "payload";
import {
  newImgField,
  sectionField,
  standardHeadline,
} from "@/lib/payload/fields";

export const ReviewSlider: Block = {
  slug: "ReviewSlider",
  interfaceName: "ReviewSliderBlock",
  fields: [
    standardHeadline,
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
    {
      name: "reviews",
      label: "Reviews",
      type: "array",
      required: true,
      fields: [
        {
          name: "review",
          label: "Review",
          type: "richText",
          required: true,
        },
        {
          name: "firstName",
          label: "Reviewer First Name",
          type: "text",
          required: true,
        },
        {
          name: "lastName",
          label: "Reviewer Last Name",
          type: "text",
          required: true,
        },
        newImgField("logo", "Logo", true),
        newImgField("profile", "Profile Image", true),
      ],
    },
    sectionField,
  ],
};
