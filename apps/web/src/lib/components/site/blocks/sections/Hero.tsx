import React from "react";
import { Section } from "../../Section";
import { HeroBlock } from "@/payload-types";
import { videoSrcAtom, videoVisibleAtom } from "@/lib/ui/VideoOverlat";
import { useSetAtom } from "jotai";
import { Button } from "@/lib/ui/shadcn/button";

export const HeroSection: React.FC<HeroBlock> = (p) => {
  const setVideoVis = useSetAtom(videoVisibleAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  function handleVideoVis() {
    if (p.salesVideoSrc) setVideoSrc(p.salesVideoSrc);
    setVideoVis(true);
  }
  return (
    <Section
      section={p.section}
      className="relative h-[100vw] lg:min-h-[700px] lg:h-[80vh] w-full px-0 py-0"
    >
      <div className="absolute w-full h-full z-20 flex justify-center">
        <div className="w-full px-7 max-w-[1536px] my-5 lg:my-50 flex flex-col justify-center items-center lg:items-start lg:justify-end gap-5">
          <div className="flex flex-col justify-center lg:items-start items-center gap-5 md:gap-6">
            <h1
              className="text-white text-center lg:text-left text-4xl font-extrabold md:text-6xl lg:text-7xl"
              dangerouslySetInnerHTML={{ __html: p.headline }}
            ></h1>
            <h2 className="text-white text-md text-center lg:text-left md:text-xl max-w-[800px]">
              {p.blurb}
            </h2>
            <div
              id="ctas"
              className="flex gap-3 justify-center items-center lg:justify-start"
            >
              <Button size="lg" className="text-foreground bg-background">
                {p.primaryCta.innerText}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-foreground bg-background"
              >
                {p.salesVideoCtaInnerText}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-full h-full z-10 bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_100%)]"></div>
      <div className="absolute w-full h-full z-10 bg-gradient-to-tr from-black/90 to-transparent"></div>
      <video
        src={p.bgVideoSrc}
        className="absolute h-full w-full object-cover z-0"
        loop
        autoPlay={true}
        muted
        playsInline
        controls={false}
      ></video>
    </Section>
  );
};
