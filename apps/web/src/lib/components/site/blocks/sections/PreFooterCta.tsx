import { PreFooterCtaBlock } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { Button } from "@/lib/ui/shadcn/button";
import Link from "next/link";
import Image from "next/image";
import { blr } from "@/lib/utils";

export const PreFooterCtaSection: React.FC<PreFooterCtaBlock> = (p) => {
  return (
    <Section
      section={p.section}
      className="relative md:min-h-[500px] lg:min-h-6xl xl:min-h-[700px] flex flex-col items-center justify-center"
    >
      <div className="relative text-white z-10 max-w-3xl flex flex-col items-center text-center gap-5 xl:gap-7 px-3">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
          {p.headline}
        </h2>
        <p className="text-white md:text-xl">{p.blurb}</p>
        <Link href={p.cta.href}>
          <Button size="lg" className="bg-white text-black">
            {p.cta.innerText}
          </Button>
        </Link>
      </div>

      <div className="absolute top-0 left-0 z-0 w-full h-full overflow-clip">
        <div className="absolute w-full h-full bg-gradient-to-t from-primary to-transparent"></div>
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.6)_100%)] z-10"></div>

        <Image
          src={p.backgroundImg.url || "/"}
          alt={p.backgroundImg.alt || ""}
          fill={true}
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 90vw"
          blurDataURL={blr(p.backgroundImg.url || "/")}
          placeholder="blur"
          className="absolute h-full w-full object-cover object-center z-[-1]"
        ></Image>
      </div>
    </Section>
  );
};
