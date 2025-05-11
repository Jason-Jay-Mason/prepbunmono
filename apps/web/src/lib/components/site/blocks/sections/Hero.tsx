import React from "react";
import { Section } from "../../Section";
import { HeroBlock } from "@/payload-types";

export const HeroSection: React.FC<HeroBlock> = (p) => {
  return (
    <Section section={p.section} className="pt-3">
      {p.headline}
    </Section>
  );
};
