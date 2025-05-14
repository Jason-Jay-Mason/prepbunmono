import { cn } from "@/lib/utils";
import { LogoSmall } from "../Logos";

export const StandardHeadline: React.FC<{
  subHeadline: string;
  headline: string;
  className?: string;
}> = (p) => {
  return (
    <div
      className={cn("flex flex-col gap-3 pb-14 justify-center", p.className)}
    >
      <div className="flex gap-1 text-inherit">
        <LogoSmall className="w-7 fill-current" />
        <h2 className="text-3xl">{p.subHeadline}</h2>
      </div>
      <h3 className="text-5xl xl:text-6xl font-extrabold">{p.headline}</h3>
    </div>
  );
};
