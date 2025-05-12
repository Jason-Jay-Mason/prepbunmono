import React from "react";
import { Section } from "../../Section";
import { HeroBlock } from "@/payload-types";

export const HeroSection: React.FC<HeroBlock> = (p) => {
  return (
    <Section section={p.section} className="h-[200vh] bg-red-100">
      <button className="bg-foreground text-background">
        {p.primaryCta.innerText}
      </button>
    </Section>
  );
};
