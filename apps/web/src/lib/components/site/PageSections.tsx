import { Page } from "@/payload-types";
import { HeroSection } from "./blocks/sections/Hero";
import { LogoTrackSection } from "./blocks/sections/LogoTrack";
import { FeaturedVideoSection } from "./blocks/sections/FeaturedVideo";
import { IconGridSection } from './blocks/sections/IconGrid'
import { LargeVideoCtaSection } from './blocks/sections/LargeVideoCta'
import { ReviewSliderSection } from './blocks/sections/ReviewSlider'
import { StatGridSection } from './blocks/sections/StatGrid'

export const PageSecitons: React.FC<Page> = (p) => (
  <>
    {p?.sections?.length ? (
      p.sections.map((s, i) => {
        const key = `${i}-${s.blockName}`;
        switch (s.blockType) {
          case "StatGrid":
            return <StatGridSection {...s} key={key} />
          case "ReviewSlider":
            return <ReviewSliderSection {...s} key={key} />
          case "LargeVideoCta":
            return <LargeVideoCtaSection {...s} key={key} />
          case "IconGrid":
            return <IconGridSection {...s} key={key} />
          case "FeaturedVideo":
            return <FeaturedVideoSection {...s} key={key} />;
          case "LogoTrack":
            return <LogoTrackSection {...s} key={key} />;
          case "Hero":
            return <HeroSection {...s} key={key} />;
        }
      })
    ) : (
      <div>No Sections</div>
    )}
  </>
);
