"use client";
import { FeaturedVideoBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { useSetAtom } from "jotai";
import { videoSrcAtom, videoVisibleAtom } from "@/lib/ui/VideoOverlat";
import { Button } from "@/lib/ui/shadcn/button";
import { PlayIcon } from "lucide-react";

export const FeaturedVideoSection: React.FC<FeaturedVideoBlock> = (p) => {
  const setVideoVis = useSetAtom(videoVisibleAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  function handleVideoVis() {
    if (p.videoSrc) setVideoSrc(p.videoSrc);
    setVideoVis(true);
  }
  return (
    <Section section={p.section}>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 max-w-screen-2xl m-auto 2xl:gap-5 xl:gap-3">
        <div className="order-2 lg:order-1 xl:col-span-2 relative overflow-clip rounded-2xl border-border w-full aspect-square sm:aspect-video lg:aspect-auto">
          <div className="absolute z-10 w-full flex h-full items-center justify-center">
            <Button
              className="bg-white text-black hover:bg-white/90"
              size="lg"
              onClick={handleVideoVis}
              id="play-video"
            >
              <PlayIcon className="fill-foreground h-full w-auto" />
              Watch Video
            </Button>
            <video
              src={p.videoPreviewSrc || ""}
              className="absolute h-full w-full object-cover z-[-1]"
              loop
              autoPlay={true}
              muted
              playsInline
              controls={false}
            ></video>
          </div>
        </div>
        <div className=" order-1 lg:order-2 xl:grid-cols-1 bg-card rounded-2xl flex flex-col gap-9 p-15 px-5 sm:px-12">
          {p.logo?.url && (
            <img src={p.logo?.url} alt={p.logo?.alt} className="w-14" />
          )}
          <h2 className="text-3xl 2xl:text-4xl font-semibold">{p.headline}</h2>
          <p>{p.blurb}</p>
          <Button className="w-min" size="lg" onClick={handleVideoVis}>
            Watch Video
          </Button>
        </div>
      </div>
    </Section>
  );
};
