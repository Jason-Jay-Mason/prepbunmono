import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const sectionVariants = cva("w-full relative", {
  variants: {
    paddingTop: {
      none: "pt-0",
      sm: "pt-5 sm:pt-12 md:pt-14",
      lg: "pt-10 md:pt-14 2xl:pt-20",
      xl: "pt-10 md:pt-20 lg:pt-32",
      "2xl": "pt-20 lg:pt-36",
      "3xl": "pt-20",
      "4xl": "pt-24",
    },
    paddingBottom: {
      none: "pb-0",
      sm: "pb-5 sm:pb-12 md:pb-14",
      lg: "pb-10 md:pb-14 2xl:pb-20",
      xl: "pb-10 md:pb-20 lg:pb-32",
      "2xl": "pb-20 lg:pb-36",
      "3xl": "pb-20",
      "4xl": "pb-24",
    },
  },
  defaultVariants: {
    paddingTop: "none",
    paddingBottom: "none",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
  section?: {
    sectionId?: string | null | undefined;
    paddingTop?: VariantProps<typeof sectionVariants>["paddingTop"];
    paddingBottom?: VariantProps<typeof sectionVariants>["paddingBottom"];
  };
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, section, children, id, ...props }, ref) => {
    return (
      <section
        {...(section?.sectionId ? { id: section.sectionId } : {})}
        ref={ref}
        className={cn(
          sectionVariants({
            paddingTop: section?.paddingTop,
            paddingBottom: section?.paddingBottom,
          }),
          "px-2",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    );
  },
);
