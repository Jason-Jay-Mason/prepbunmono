"use client";

import { Section } from "../../Section";
import { HeroBlock } from "@/payload-types";
import { videoSrcAtom, videoVisibleAtom } from "@/lib/ui/VideoOverlat";
import { useSetAtom } from "jotai";
import { Button } from "@/lib/ui/shadcn/button";
import { PlayIcon } from "lucide-react";

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
      className="relative bg-red-100 h-full py-10 sm:py-0 sm:h-[100vw] min-h-max lg:min-h-[800px] lg:h-[80vh] w-full px-0 "
    >
      <div className="relative sm:absolute w-full h-full z-20 flex justify-center">
        <div className="w-full px-4 md:px-7 max-w-[1536px] my-5 lg:my-20 2xl:my-30 flex flex-col justify-center items-center lg:items-start lg:justify-end gap-5">
          <div className="flex flex-col justify-center lg:items-start items-center gap-5 md:gap-6">
            <h1
              className="text-white text-center lg:text-left text-4xl font-extrabold md:text-5xl lg:text-5xl 2xl:text-6xl"
              dangerouslySetInnerHTML={{ __html: p.headline }}
            ></h1>
            <h2 className="text-white text-md text-center lg:text-left md:text-xl max-w-[800px] pb-2">
              {p.blurb}
            </h2>
            <div
              id="ctas"
              className="flex flex-col sm:flex-row gap-3 justify-center items-center lg:justify-start w-full"
            >
              <Button
                size="lg"
                className="text-foreground bg-background hover:bg-white/90 hover:text-primary w-[80%] sm:w-max"
              >
                {p.primaryCta.innerText}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-background hover:text-white hover:bg-white/10 w-[80%] sm:w-max"
                onClick={handleVideoVis}
              >
                <PlayIcon></PlayIcon>
                {p.salesVideoCtaInnerText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-full h-full herogradient z-10 top-0"></div>
      <video
        className="absolute h-full w-full object-cover z-0 top-0"
        loop
        autoPlay
        muted
        playsInline
        controls={false}
      >
        <source src={p.bgVideoSrc} type="video/mp4" />
      </video>
    </Section>
  );
};

// <div className="absolute top-0 w-full h-full z-10 bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_100%)]"></div>
// <div className="absolute top-0 w-full h-full z-10 bg-gradient-to-tr from-black/90 to-transparent"></div>
