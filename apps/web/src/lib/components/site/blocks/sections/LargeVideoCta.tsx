import { LargeVideoCtaBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { Button } from "@/lib/ui/shadcn/button";
import Link from "next/link";

export const LargeVideoCtaSection: React.FC<LargeVideoCtaBlock> = (p) => {
  return (
    <Section
      section={p.section}
      className="relative overflow-clip  min-h-[60vh] h-full flex justify-center items-center "
    >
      <div className="relative z-30 text-center flex flex-col items-center gap-5 xl:gap-7 px-2 max-w-2xl xl:max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl xl:text-8xl text-white font-extrabold">
          {p.headline}
        </h2>
        <p className="text-white xl:text-xl xl:max-w-[700px]">{p.blurb}</p>
        <Link href={p.cta.href}>
          <Button
            size="lg"
            className="bg-white text-foreground hover:bg-white/90"
          >
            {p.cta.innerText}
          </Button>
        </Link>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-10 videoctagradient"></div>
      <video
        className="absolute h-full w-full object-cover z-0 top-0 left-0"
        loop
        autoPlay
        muted
        playsInline
        controls={false}
      >
        <source src={p.bgVideoSource || "/"} type="video/mp4" />
      </video>
    </Section>
  );
};

// bg-[radial-gradient(circle,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0)_200%)]
//
