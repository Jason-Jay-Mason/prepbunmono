import { cn } from "@/lib/utils/clientUtils";
import { LogoSmall } from "../Logos";

export const StandardHeadline: React.FC<{
  subHeadline?: string | null | undefined;
  headline?: string | null | undefined;
  className?: string;
}> = (p) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 md:gap-3 pb-14 justify-center",
        p.className,
      )}
    >
      <div className="flex gap-1 text-inherit">
        {p.subHeadline && (
          <>
            <LogoSmall className=" w-5 md:w-7 fill-current" />
            <h2 className="text-xl md:text-3xl">{p.subHeadline}</h2>
          </>
        )}
      </div>
      <h3 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold">
        {p.headline}
      </h3>
    </div>
  );
};
