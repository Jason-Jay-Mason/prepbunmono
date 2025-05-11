import { Page } from "@/payload-types";
import { HeroSection } from "./blocks/sections/Hero";

export const PageSecitons: React.FC<Page> = (p) => (
  <>
    {p?.sections?.length ? (
      p.sections.map((s, i) => {
        const key = `${i}-${s.blockName}`;
        switch (s.blockType) {
          case "Hero":
            return <HeroSection {...s} key={key} />;
        }
      })
    ) : (
      <div>No Sections</div>
    )}
  </>
);
