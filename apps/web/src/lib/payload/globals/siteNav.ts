import { Block, GlobalConfig } from "payload";
import { loggedIn } from "../access/functions";
import { newImgField } from "../fields";

const SiteNavImageMenu: Block = {
  slug: "SiteNavImageMenu",
  interfaceName: "SiteNavImageMenuBlock",
  fields: [
    {
      name: "label",
      label: "Label",
      type: "text",
    },
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
    newImgField("image", "Image", true),
    {
      name: "links",
      label: "Links",
      type: "array",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
        },
        {
          name: "blurb",
          label: "Blurb",
          type: "text",
        },
        {
          name: "href",
          label: "Href",
          type: "text",
        },
      ],
    },
  ],
};

const SiteNavLink: Block = {
  slug: "SiteNavLink",
  interfaceName: "SiteNavLinkBlock",
  fields: [
    {
      name: "link",
      label: "Link",
      type: "group",
      fields: [
        {
          name: "href",
          label: "Link Href",
          type: "text",
          required: true,
        },
        {
          name: "innerText",
          label: "Label",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
export const SiteNav: GlobalConfig = {
  slug: "sitenav",
  label: "Site Nav",
  access: {
    update: loggedIn,
    readDrafts: loggedIn,
  },
  fields: [
    {
      name: "links",
      label: "Links",
      type: "blocks",
      required: true,
      maxRows: 8,
      blocks: [SiteNavLink, SiteNavImageMenu],
    },
  ],
};
