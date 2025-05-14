"use client";

import { StatGridBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { useScrollPosition } from "@/lib/hooks";
import { useEffect, useMemo, useRef, useState } from "react";

export const StatGridSection: React.FC<StatGridBlock> = (p) => {
  const [x, y] = useScrollPosition();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useMemo(() => {
    if (!sectionRef.current) return;
    const top = document.body.clientHeight - sectionRef.current.clientHeight;
    if (y > top) return true;
    return false;
  }, [y]);
  useEffect(() => {
    console.log(inView);
  }, [inView]);
  return (
    <Section section={p.section} ref={sectionRef}>
      <div className="grid gap-10  sm:grid-cols-3 justify-center items-center max-w-screen-2xl mx-auto">
        {p.stats.map((s, i) => (
          <div className="flex flex-col" key={`${i}-stat`}>
            <span className="text-5xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold">
              {s.prefix}
              <Counter show={inView || false} n={s.number} />
              {s.suffix}
            </span>
            <h3 className="text-base sm:text-base md:text-lg lg:text-2xl xl:text-2xl">
              {s.blurb}
            </h3>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Counter: React.FC<{ n: number; show: boolean }> = ({ n, show }) => {
  const [num, setNum] = useState(0);
  const numRef = useRef(num);
  numRef.current = num;
  const inc = n / 100;

  const count = () => {
    if (numRef.current > n) return;
    setNum((prev) => prev + inc);
    return requestAnimationFrame(count);
  };

  useEffect(() => {
    if (!show) setNum(0);
    const ts = requestAnimationFrame(count);
    return () => {
      cancelAnimationFrame(ts);
    };
  }, [show]);
  return <>{Math.floor(num)}</>;
};
