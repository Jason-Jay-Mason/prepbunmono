import { Block } from "payload"
import { sectionField } from "@/lib/payload/fields"

export const ContactForm: Block = {
  slug: "ContactForm",
  interfaceName: "ContactFormBlock",
  fields: [
    sectionField,
  ],
}
