"use client";
import { HeroVideoBoxBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { useSetAtom } from "jotai";
import { videoSrcAtom, videoVisibleAtom } from "@/lib/ui/VideoOverlat";
import { Button } from "@/lib/ui/shadcn/button";
import { PlayIcon } from "lucide-react";
import Link from "next/link";

export const HeroVideoBoxSection: React.FC<HeroVideoBoxBlock> = (p) => {
  const setVideoVis = useSetAtom(videoVisibleAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  function handleVideoVis() {
    if (p.salesVideoSrc) setVideoSrc(p.salesVideoSrc);
    setVideoVis(true);
  }
  return (
    <Section
      section={p.section}
      className="relative h-full py-10 sm:py-0 sm:h-[100vw] min-h-max lg:min-h-[800px] lg:h-[80vh] w-full flex justify-center px-5"
    >
      <div className="relative border rounded-2xl w-full h-full max-w-[1485px] overflow-clip flex items-center lg:items-end">
        <div className="relative w-full md:w-fit z-20 py-10 px-5 md:p-20">
          <div className="flex flex-col justify-center lg:items-start items-center gap-5 md:gap-6 w-full">
            <h1
              className="text-white text-center lg:text-left text-4xl font-extrabold md:text-5xl lg:text-5xl 2xl:text-5xl"
              dangerouslySetInnerHTML={{ __html: p.headline }}
            ></h1>
            <h2 className="text-white text-md text-center lg:text-left md:text-xl max-w-[600px] pb-2">
              {p.blurb}
            </h2>
            <div
              id="ctas"
              className="flex flex-col sm:flex-row gap-3 justify-center items-center lg:justify-start w-full"
            >
              <Link href={p.primaryCta.href}>
                <Button
                  size="lg"
                  className="text-foreground bg-background hover:bg-white/90 hover:text-primary w-[80%] sm:w-max"
                >
                  {p.primaryCta.innerText}
                </Button>
              </Link>

              {p.salesVideoSrc && (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-background hover:text-white hover:bg-white/10 w-[80%] sm:w-max"
                  onClick={handleVideoVis}
                >
                  <PlayIcon></PlayIcon>
                  {p.salesVideoCtaInnerText}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute w-full h-full  boxgradient z-10 top-0"></div>
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
      </div>
    </Section>
  );
};
