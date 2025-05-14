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
import {
  CalendarPlus,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

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
                <CalendarPlus></CalendarPlus>
                Free Session
              </Button>
            </Link>
            <Link href="/login" id="primary-cta-nav">
              <Button
                size="sm"
                className={cn(
                  absolute
                    ? "border-background text-foreground bg-background group-hover/nav:text-background group-hover/nav:bg-foreground"
                    : "group-hover/nav:text-foreground",
                  sticky && "bg-foreground text-background",
                )}
              >
                Log In
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
                  return (
                    <NavigationBarModelAccordian
                      key={`${l.id}-${i}`}
                      block={l}
                      num={i}
                    />
                  );
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
      <Footer {...nav} />
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

const Footer: React.FC<Sitenav> = (p) => {
  return (
    <footer className="w-full bg-primary py-20 px-5">
      <div className="w-full max-w-[1560px] mx-auto">
        <nav className="flex flex-col xl:grid xl:grid-cols-3 xl:items-center xl:justify-center gap-5 items-center md:items-start md:px-10 2xl:px-20">
          <div className="flex flex-col lg:flex-row gap-5 items-start xl:col-span-2">
            <Logo className="fill-white w-40" />
            <div className="flex flex-col md:flex-row md:items-start text-white items-center md:ml-[-10px]">
              {p.links.map((l, i) => {
                switch (l.blockType) {
                  case "SiteNavImageMenu":
                    return (
                      <React.Fragment key={`${l.id}-${i}-blob`}>
                        {l.links &&
                          l.links.map((li, j) => (
                            <NavigationBarModelLink
                              key={`${i}-${j}`}
                              href={li.href || "/"}
                              className="text-white border-none hover:bg-white/10 hover:text-white rounded-lg"
                            >
                              {li.title}
                            </NavigationBarModelLink>
                          ))}
                      </React.Fragment>
                    );
                  case "SiteNavLink":
                    return (
                      <NavigationBarModelLink
                        key={`${l.id}-${i}-${l.id}`}
                        href={l.link.href}
                        className="text-white border-none hover:bg-white/10 hover:text-white rounded-lg"
                      >
                        {l.link.innerText}
                      </NavigationBarModelLink>
                    );
                }
              })}
            </div>
          </div>
          <div
            id="social"
            className="flex justify-start gap-5 text-white items-center xl:w-full xl:place-content-end"
          >
            <Instagram className="w-7 h-7 cursor-pointer" />
            <Facebook className="w-7 h-7 cursor-pointer" />
            <Twitter className="w-7 h-7 cursor-pointer" />
            <Youtube className="w-7 h-7 cursor-pointer" />
            <Linkedin className="w-7 h-7 cursor-pointer" />
          </div>
          <div id="disclaimer" className="xl:col-span-2">
            <p className="text-sm text-white/60 text-center md:text-left">
              SAT® trademark is owned by the College Board, which is not
              affiliated with, and does not endorse, this website.
            </p>
          </div>
          <div className="flex justify-start gap-5 text-white items-center xl:w-full xl:place-content-end">
            <Button className="text-black hover:text-black bg-white hover:bg-white/90">
              Sign In
            </Button>
          </div>
        </nav>
      </div>
    </footer>
  );
};
