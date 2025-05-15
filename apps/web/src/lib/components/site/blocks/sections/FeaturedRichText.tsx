import { FeaturedRichTextBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { StandardHeadline } from "../../StandardHeadline";
import { RichText } from "@payloadcms/richtext-lexical/react";

export const FeaturedRichTextSection: React.FC<FeaturedRichTextBlock> = (p) => {
  return (
    <Section section={p.section} className="px-5">
      <div className="max-w-screen-2xl m-auto">
        <StandardHeadline
          {...p.standardHeadline}
          className="pb-8"
        ></StandardHeadline>
        <RichText
          data={p.body}
          className="max-w-screen-lg text-base md:text-lg"
        ></RichText>
      </div>
    </Section>
  );
};
