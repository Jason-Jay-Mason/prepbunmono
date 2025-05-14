"use client";

import { Media, ReviewSliderBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { StandardHeadline } from "../../StandardHeadline";
import { Button } from "@/lib/ui/shadcn/button";
import { ArrowLeft, PlayIcon } from "lucide-react";
import { useSetAtom } from "jotai";
import { videoSrcAtom, videoVisibleAtom } from "@/lib/ui/VideoOverlat";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useMemo, useRef, useState } from "react";
import { blr, cn } from "@/lib/utils";
import Image from "next/image";

export const ReviewSliderSection: React.FC<ReviewSliderBlock> = (p) => {
  const setVideoVis = useSetAtom(videoVisibleAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  function handleVideoVis() {
    if (p.videoSrc) setVideoSrc(p.videoSrc);
    setVideoVis(true);
  }

  const [cards, setCards] = useState([...p.reviews, ...p.reviews]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  const [position, setPosition] = useState(0);

  const getCardWidth = () => {
    if (!cardRef.current) return;
    const styles = window.getComputedStyle(cardRef.current);
    const marginRight = parseFloat(styles.marginRight);
    const rect = cardRef.current?.getBoundingClientRect();
    const width = rect.width + marginRight;
    return width;
  };

  const handleNext = () => {
    if (animate) return;
    const width = getCardWidth();
    if (!width) return;
    setPosition((prev) =>
      Math.min(prev - width, (p.reviews?.length || 0) * width),
    );

    setAnimate(true);
    setTimeout(() => {
      if (!cards) return;
      const head = cards.shift();
      if (!head) return;
      setCards([...cards, head]);
      setPosition(0);
      setAnimate(false);
    }, 300);
  };

  const handleBack = () => {
    if (animate) return;
    const width = getCardWidth();
    if (!width) return;
    setPosition((prev) => Math.max(prev + width, 0));

    setAnimate(true);
    setTimeout(() => {
      if (!cards) return;
      const tail = cards.pop();
      if (!tail) return;
      setCards([tail, ...cards]);
      setPosition(0);
      setAnimate(false);
    }, 300);
  };

  const scrollStyles = useMemo(() => {
    if (position === 0) {
      return {
        transform: `translate3d(${position}px, 0px, 0px)`,
      };
    }
    return {
      transform: `translate3d(${position}px, 0px, 0px)`,
      transition: "transform 0.3s ease-out",
    };
  }, [position]);

  return (
    <Section section={p.section} className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:gap-5 max-w-screen-2xl m-auto">
        <StandardHeadline
          {...p.standardHeadline}
          className="text-foreground w-full pb-5 xl:col-span-2"
        />
        <div className="lg:col-start-1 lg:col-end-2 xl:col-start-1 xl:col-end-3 mb-5 col-span-1 relative overflow-clip rounded-2xl border-border w-full h-auto aspect-square sm:aspect-video lg:aspect-auto xl:min-h-[600px] lg:mb-0">
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

        <div className="lg:col-start-2 lg:col-end-2 xl:col-start-3 xl:col-end-3 lg:row-start-1 lg:row-end-1 lg:items-end flex gap-2 pb-5">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft />
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>

        <div
          className="relative h-auto w-full left-0 translate-x-[-100vw] md:translate-x-[-450px]"
          style={scrollStyles}
        >
          <div className="col-start-2 col-end-3 w-fit h-full relative top-0 flex justify-start items-start gap-0">
            {cards &&
              cards.map((r, i) => {
                return (
                  <div
                    ref={cardRef}
                    key={`${i}`}
                    className={cn(
                      "bg-card rounded-2xl flex flex-col justify-between gap-9 w-[94dvw] mr-[6dvw] md:w-[420px] md:mr-[30px] py-9 px-6 lg:py-12 lg:px-10 md:h-full",
                      i === 0 && position <= 0 ? "opacity-0" : "opacity-100",
                    )}
                  >
                    <RichText data={r.review} />
                    <div className="flex justify-start items-center w-full gap-5">
                      <ProfilePhoto img={r.profile} />
                      <div className="flex flex-col gap-0 items-start">
                        <p className="text-xl font-semibold">
                          {r.firstName} {r.lastName}
                        </p>
                        <img
                          src={r.logo.url || "/"}
                          className="max-h-[20px] w-auto"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Section>
  );
};

const ProfilePhoto: React.FC<{ img: Media }> = ({ img }) => (
  <div className="border-foreground relative h-14 w-14 overflow-hidden rounded-full">
    <Image
      fill={true}
      sizes="(max-width: 768px) 100px, (max-width: 1200px) 100px"
      blurDataURL={blr(img?.url || "/")}
      placeholder="blur"
      src={img?.url || "/"}
      className="absolute inset-0 h-full w-full object-cover"
      alt={img?.alt || "No alt"}
    />
  </div>
);
