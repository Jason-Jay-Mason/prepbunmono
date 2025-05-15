import { SmallHeroBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";

export const SmallHeroSection: React.FC<SmallHeroBlock> = (p) => {
  return (
    <Section section={p.section} className="text-white bg-primary px-5">
      <div className="max-w-[1480px] mx-auto flex items-center justify-center lg:justify-start h-full w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
          {p.headline}
        </h1>
      </div>
    </Section>
  );
};
