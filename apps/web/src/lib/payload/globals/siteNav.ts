import { GlobalConfig } from "payload";
import { loggedIn } from "../access/functions";
import { linkField } from "../fields";

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
      type: "array",
      required: true,
      maxRows: 8,
      fields: [linkField],
    },
  ],
};
