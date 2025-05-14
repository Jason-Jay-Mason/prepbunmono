import { IconGridBlock, Media } from "@/payload-types";
import { Section } from "@/lib/components/site/Section";
import { StandardHeadline } from "../../StandardHeadline";

export const IconGridSection: React.FC<IconGridBlock> = (p) => {
  return (
    <Section section={p.section} className="bg-primary">
      <div className="max-w-screen-2xl m-auto px-2 md:px-5 lg:px-9 xl:px-12">
        <StandardHeadline {...p.standardHeadline} className="text-white" />
        <div className="grid-cols-1 md:grid-cols-2 gap-12 xl:gap-20 2xl:gap-26 m-auto grid lg:grid-cols-3">
          {p.gridCells.map((g, i) => (
            <IconGridCell
              headline={g.headline}
              icon={g.icon}
              blurb={g.blurb}
              key={`${g.id}${i}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export const IconGridCell: React.FC<{
  icon: Media;
  headline: string;
  blurb: string;
}> = (p) => (
  <div className="flex flex-col gap-4 xl:gap-5">
    <div className="bg-white/20 w-[47px] p-2 rounded-lg">
      <img
        src={p.icon.url || "/"}
        alt={p.icon.alt}
        className="w-full full-current filter invert brightness-0 contrast-100"
      />
    </div>

    <h4 className="text-2xl xl:text-3xl text-white font-semibold">
      {p.headline}
    </h4>
    <p className="text-white xl:text-lg">{p.blurb}</p>
  </div>
);
