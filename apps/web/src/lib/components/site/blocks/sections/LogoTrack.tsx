"use client";

import { LogoTrackBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { useEffect, useMemo, useRef } from "react";

export const LogoTrackSection: React.FC<LogoTrackBlock> = (p) => {
  const logos = useMemo(() => {
    if (!p.logos) return;
    if (!p.logos.length) return;
    return [...p.logos, ...p.logos, ...p.logos, ...p.logos];
  }, [p.logos]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const animate = (t: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.scrollWidth / 4;
    const gap = window.innerWidth <= 768 ? 10 : 25;
    const scroll = scrollRef.current.scrollLeft - gap;
    const isHalfWay = scroll > width;
    if (isHalfWay) scrollRef.current?.scrollTo({ left: 0 });
    scrollRef.current?.scrollBy({ left: 1 });
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const time = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(time);
    };
  }, []);
  return (
    <Section
      section={p.section}
      className="relative flex flex-col justify-center items-center overflow-x-clip"
    >
      <p className="text-foreground text-3xl pb-12 text-center">{p.blurb}</p>
      <div
        className="relative flex gap-[40px] md:gap-[100px] overflow-x-auto w-full no-scrollbar max-h-min h-[50px] md:h-[80px]"
        ref={scrollRef}
      >
        {logos &&
          logos.map((l, i) => {
            return (
              <div className="min-w-[140px] md:min-w-[300px] flex justify-center items-end">
                <img
                  key={`logo-${i}`}
                  className="w-auto h-full"
                  src={l.src.url || "/"}
                  alt={l.src.alt}
                />
              </div>
            );
          })}
      </div>
    </Section>
  );
};
