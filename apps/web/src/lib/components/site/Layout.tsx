"use client";

import { Sitenav, SiteNavImageMenuBlock } from "@/payload-types";
import Link from "next/link";
import {
  NavigationBar,
  NavigationBarLeft,
  NavigationBarLogo,
  NavigationBarModel,
  NavigationBarLink,
  NavigationBarDesktopLinks,
  NavigationBarContent,
  NavigationBarModalControl,
  navAbsoluteAtom,
  navStickyAtom,
  NavigationBarModelLink,
} from "@/lib/ui/NavigationBar";
import { Button } from "@/lib/ui/shadcn/button";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/lib/ui/shadcn/navigation-menu";
import {
  NavigationMenuContent,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import React from "react";
import Image from "next/image";
import { blr, cn } from "@/lib/utils";
import { Logo, LogoSmall } from "../Logos";
import { useAtomValue } from "jotai";
import {
  AccordionItem,
  AccordionTrigger,
  Accordion,
  AccordionContent,
} from "@/lib/ui/shadcn/accordion";

const linkstyles =
  "text-md px-4 py-5 md:text-base 2xl:text-md bg-transparent focus:bg-card hover:bg-muted group-hover/nav:text-foreground";
export const SiteLayout: React.FC<{
  nav: Sitenav;
  children: React.ReactNode;
}> = ({ nav, children }) => {
  const absolute = useAtomValue(navAbsoluteAtom);
  const sticky = useAtomValue(navStickyAtom);
  return (
    <>
      <NavigationBar
        spacerClassName="h-9"
        className={cn(absolute ? "group/nav hover:bg-background" : "")}
      >
        <NavigationBarContent className="px-5 md:px-7">
          <NavigationBarLeft>
            <NavigationBarLogo
              className="w-30 lg:w-28 2xl:w-32"
              stickyClassName="lg:w-25 2xl:w-30"
            >
              <Logo
                className={cn(
                  absolute
                    ? "lg:group-hover/nav:fill-foreground lg:fill-background fill-foreground"
                    : "fill-foreground",
                  sticky && "lg:fill-foreground",
                )}
              />
            </NavigationBarLogo>
            <NavigationBarDesktopLinks
              className={cn(
                "gap-0 xl:gap-1",
                absolute
                  ? "group-hover/nav:text-foreground text-background"
                  : "text-foreground",
                absolute && sticky && "text-foreground",
              )}
            >
              {nav.links.map((l, i) => {
                switch (l.blockType) {
                  case "SiteNavLink":
                    return (
                      <NavigationBarLink
                        className={linkstyles}
                        href={l.link.href}
                        key={`${l.id}-${i}`}
                      >
                        {l.link.innerText}
                      </NavigationBarLink>
                    );
                  case "SiteNavImageMenu":
                    return (
                      <NavigationBarImageMenu
                        {...l}
                        key={`${l.id}-${i}`}
                      ></NavigationBarImageMenu>
                    );
                }
              })}
            </NavigationBarDesktopLinks>
          </NavigationBarLeft>

          <NavigationBarDesktopLinks>
            <Link href="/login" id="primary-cta-nav">
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  absolute
                    ? "border-background text-background group-hover/nav:text-foreground group-hover/nav:border-foreground"
                    : "group-hover/nav:text-foreground",
                  sticky && "text-foreground border-foreground",
                )}
              >
                Log In
              </Button>
            </Link>

            <Link href="https://meetings-na2.hubspot.com/thao-bui">
              <Button
                size="sm"
                className={cn(
                  absolute
                    ? "border-background text-foreground bg-background group-hover/nav:text-background group-hover/nav:bg-foreground"
                    : "group-hover/nav:text-foreground",
                  sticky && "bg-foreground text-background",
                )}
              >
                Free Session
              </Button>
            </Link>

            <NavigationBarLink
              href="/contact"
              className={cn(
                linkstyles,
                "gap-0 xl:gap-1",
                absolute
                  ? "group-hover/nav:text-foreground text-background"
                  : "text-foreground",
                absolute && sticky && "text-foreground",
              )}
            >
              Contact
            </NavigationBarLink>
          </NavigationBarDesktopLinks>
          <NavigationBarModalControl />
        </NavigationBarContent>
        <NavigationBarModel>
          <div id="links">
            {nav.links.map((l, i) => {
              switch (l.blockType) {
                case "SiteNavImageMenu":
                  return <NavigationBarModelAccordian block={l} num={i} />;
                case "SiteNavLink":
                  return (
                    <NavigationBarModelLink
                      key={`${l.id}-${i}`}
                      href={l.link.href}
                    >
                      {l.link.innerText}
                    </NavigationBarModelLink>
                  );
              }
            })}

            <NavigationBarModelLink href="/contact">
              Contact
            </NavigationBarModelLink>
          </div>
          <div id="buttons" className="flex gap-2 pt-10 px-3">
            <Link href="/login" id="primary-cta-nav">
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  absolute
                    ? "border-background text-background group-hover/nav:text-foreground group-hover/nav:border-foreground"
                    : "group-hover/nav:text-foreground",
                  sticky && "text-foreground border-foreground",
                )}
              >
                Log In
              </Button>
            </Link>

            <Link href="https://meetings-na2.hubspot.com/thao-bui">
              <Button
                size="sm"
                className={cn(
                  absolute
                    ? "border-background text-foreground bg-background group-hover/nav:text-background group-hover/nav:bg-foreground"
                    : "group-hover/nav:text-foreground",
                  sticky && "bg-foreground text-background",
                )}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </NavigationBarModel>
      </NavigationBar>
      {children}
    </>
  );
};

const NavigationBarModelAccordian: React.FC<{
  block: SiteNavImageMenuBlock;
  num: number;
}> = (p) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-b border-border"
    >
      <AccordionItem
        value={`item-${p.num}`}
        className="cursor-pointer text-xl w-full py-3 px-4 p-0 hover:bg-muted "
      >
        <AccordionTrigger className="w-full px-4 hover:no-underline text-base py-3">
          {p.block.label}
        </AccordionTrigger>
        <AccordionContent>
          {p.block.links &&
            p.block.links.map((l, i) => (
              <NavigationBarModelLink
                key={`${l.id}-${i}`}
                href={l.href || "/"}
                className="border-none pl-5 hover:bg-background"
              >
                <p className="font-semibold"> {l.title}</p>
                <p className="text-sm">{l.blurb}</p>
              </NavigationBarModelLink>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const NavigationBarImageMenu: React.FC<SiteNavImageMenuBlock> = (p) => {
  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger className={linkstyles}>
        {p.label}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bottom-0 border border-border rounded-sm translate-y-[calc(100%+9px)] bg-background absolute">
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a
                href="/"
                className="relative flex h-full w-full text-background select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-foreground p-6 no-underline outline-none focus:shadow-md"
              >
                <LogoSmall className="relative h-6 w-6 z-10 fill-background mb-2" />
                <div className="text-lg font-medium z-1 pb-2 leading-tight">
                  {p.headline}
                </div>
                <p className="text-sm leading-tight z-1 text-background">
                  Beautifully designed components built with Radix UI and
                  Tailwind CSS.
                </p>
                {p.image.url && (
                  <Image
                    src={p.image.url}
                    alt={p.image.alt || ""}
                    fill={true}
                    sizes="(max-width: 768px) 10vw, (max-width: 1200px) 10vw"
                    blurDataURL={blr(p.image.url)}
                    placeholder="blur"
                    className="absolute h-full w-full rounded-md object-cover object-top z-[-1]"
                  ></Image>
                )}
              </a>
            </NavigationMenuLink>
          </li>
          {p.links &&
            p.links.map((link, i) => (
              <ListItem
                className="text-lg"
                key={`${link.title}${i}`}
                title={link.title || ""}
                href={link.href || "/"}
              >
                {link.blurb}
              </ListItem>
            ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-base font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
