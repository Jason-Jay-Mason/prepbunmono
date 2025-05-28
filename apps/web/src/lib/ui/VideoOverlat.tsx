"use client";
import { atom, useAtom, useAtomValue } from "jotai";
import React from "react";
import { X } from "lucide-react";
import { cn } from "../utils/clientUtils";

//TODO: maybe add CTA here
export const videoVisibleAtom = atom<boolean>(false);
export const videoSrcAtom = atom<string>("");

const baseVideoContainerClasses =
  "border-border aspect-video w-full md:max-w-[80%] lg:max-w-7xl overflow-clip rounded-3xl transition-all animate-fade-in";

export const VideoOverlay = React.forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
  const [videoVis, setVideoVis] = useAtom(videoVisibleAtom);
  const vidSrc = useAtomValue(videoSrcAtom);

  return (
    <>
      {videoVis ? (
        <div className="fixed top-0 right-0 z-[200] flex h-full w-full flex-col items-center justify-center bg-black/80 px-5">
          <button
            className="absolute top-10 right-10 flex h-12 w-12 cursor-pointer items-center text-white"
            onClick={() => setVideoVis(false)}
          >
            <X className="h-full w-full" />
          </button>

          <div ref={ref} className={cn(baseVideoContainerClasses, className)}>
            <video
              src={vidSrc}
              className="h-full w-full object-cover"
              autoPlay
              controls
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
});

VideoOverlay.displayName = "VideoOverlay";
