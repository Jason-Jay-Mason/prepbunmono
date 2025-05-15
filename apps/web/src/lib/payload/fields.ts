import { Field } from "payload";

export const linkField: Field = {
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
};

export const standardHeadline: Field = {
  name: "standardHeadline",
  label: "Standard Headline",
  type: "group",
  fields: [
    {
      name: "subHeadline",
      label: "Sub Headline",
      type: "text",
    },
    {
      name: "headline",
      label: "Headline",
      type: "text",
    },
  ],
};

export function newImgField(
  name: string,
  label: string = "Image",
  required: boolean = true,
): Field {
  return {
    name: name,
    label: label,
    type: "upload",
    typescriptSchema: [
      ({ jsonSchema }) => ({
        ...jsonSchema,
        tsType: "Media",
      }),
    ],
    relationTo: "media",
    required: required,
  };
}

export const sectionField: Field = {
  name: "section",
  label: "Section",
  type: "group",
  fields: [
    {
      name: "sectionId",
      label: "Id",
      type: "text",
      required: true,
    },
    {
      name: "paddingTop",
      label: "Padding Top",
      type: "select",
      defaultValue: "none",
      options: ["none", "sm", "lg", "xl", "2xl", "3xl", "4xl"],
      required: true,
    },
    {
      name: "paddingBottom",
      label: "Padding Bottom",
      type: "select",
      defaultValue: "none",
      options: ["none", "sm", "lg", "xl", "2xl", "3xl", "4xl"],
      required: true,
    },
  ],
};

export function newCtaField(
  name: string,
  label: string = "Call To Action",
): Field {
  return {
    name: name,
    label: label,
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
  };
}

export const seoField: Field = {
  name: "seo",
  label: "Seo",
  type: "group",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
    },
    {
      name: "publishDate",
      label: "Publish Date",
      type: "date",
    },
    {
      name: "siteMapPriority",
      label: "Site Map Priority",
      type: "number",
    },
    {
      name: "geo",
      label: "Geo",
      type: "group",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
        },
        {
          name: "pin",
          label: "Pin Latitude",
          type: "point",
        },
      ],
    },
    {
      name: "category",
      label: "Category",
      type: "text",
    },
    {
      name: "robots",
      label: "Robots",
      type: "group",
      fields: [
        {
          name: "noindex",
          label: "No Index",
          type: "checkbox",
        },
        {
          name: "nofollow",
          label: "No Follow",
          type: "checkbox",
        },
        {
          name: "nocache",
          label: "No Cache",
          type: "checkbox",
        },
      ],
    },
    {
      name: "twitter",
      label: "Twitter",
      type: "group",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "text",
        },
        newImgField("image", "Image", true),
      ],
    },
    {
      name: "openGraph",
      label: "Open Graph",
      type: "group",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "text",
        },
        newImgField("image", "Image", true),
        {
          name: "alt",
          label: "Alt",
          type: "text",
        },
      ],
    },
  ],
};
