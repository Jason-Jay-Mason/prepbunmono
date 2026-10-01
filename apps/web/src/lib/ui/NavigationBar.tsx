"use client";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/lib/utils/clientUtils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/lib/hooks";

//Global state opinions suck in react and I loath them, it is useful sometimes for reuseability; I bring in atom for global client side state so we don't have to deal with context
export const modelActiveAtom = atom(false);
export const navStickyAtom = atom(false);
export const navAbsoluteAtom = atom<boolean | null>(null);

// Shared so every part of the nav (bg, text, logo fill, borders) fades in sync
export const navTransition =
  "transition-[color,background-color,border-color,fill,box-shadow] duration-300 ease-out motion-reduce:transition-none";

const baseNavBarStyles =
  "border-b lg:-mb-[61px] border-transparent w-full sticky top-0  z-[100] will-change-[translate] transition-[translate,color,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

const HIDE_THRESHOLD = 200; // px from top before the nav can hide
// Distance that must be travelled in ONE direction before the nav toggles.
// Reveal needs more intent than hide so small upward nudges while reading don't pop it back.
const HIDE_TOLERANCE = 16;
const SHOW_TOLERANCE = 48;

// Discrete "headroom" behaviour: scroll travel accumulates per direction and resets
// whenever the direction flips, so jitter never reaches a tolerance and the nav
// only ever animates fully in or fully out. Re-renders only when a value toggles.
function useNavScroll(
  spacerRef: React.RefObject<HTMLDivElement | null>,
  pinned: boolean,
) {
  const [state, setState] = useState({ sticky: false, hidden: false });

  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let travel = 0; // signed px moved in the current direction
    let hidden = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY); // ignore iOS overscroll bounce
      const delta = y - lastY;
      lastY = y;

      // Direction changed: start counting from zero again
      if (delta !== 0 && Math.sign(delta) !== Math.sign(travel)) travel = 0;
      travel += delta;

      if (pinned || y <= HIDE_THRESHOLD) hidden = false;
      else if (!hidden && travel >= HIDE_TOLERANCE) hidden = true;
      else if (hidden && travel <= -SHOW_TOLERANCE) hidden = false;

      const sticky = y > (spacerRef.current?.offsetHeight ?? 0);
      setState((s) =>
        s.sticky === sticky && s.hidden === hidden ? s : { sticky, hidden },
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [spacerRef, pinned]);

  return state;
}

function NavigationBar(p: {
  children: React.ReactNode;
  spacerClassName?: string;
  className?: string;
}) {
  const [modelActive, setModelActive] = useAtom(modelActiveAtom);
  const setSticky = useSetAtom(navStickyAtom);
  const { width } = useWindowSize();
  const spacerRef = useRef<HTMLDivElement>(null);
  const { sticky, hidden } = useNavScroll(spacerRef, modelActive);

  useEffect(() => {
    setSticky(sticky);
  }, [sticky, setSticky]);

  // Width only: iOS changes innerHeight as the address bar collapses on scroll
  useEffect(() => {
    setModelActive(false);
  }, [width, setModelActive]);

  // absolute ? "lg:-mb-[61px]" : "mb-0",
  return (
    <>
      <div
        ref={spacerRef}
        className={cn(
          "hidden h-5 lg:flex justify-center items-center bg-primary",
          p.spacerClassName,
        )}
      >
        <p className="text-white text-sm">
          We are offering summer camps, view our schedule to learn more.
        </p>
      </div>
      <header
        className={cn(
          baseNavBarStyles,
          hidden ? "-translate-y-full" : "translate-y-0",
          sticky
            ? "border-border bg-background border-b text-foreground fill-foreground"
            : "bg-transparent",
          modelActive && "bg-card",
          p.className,
        )}
      >
        {p.children}
      </header>
    </>
  );
}

interface NavigationBarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
const NavigationBarContent = React.forwardRef<
  HTMLDivElement,
  NavigationBarContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "m-auto flex h-[60px] max-w-[1536px] items-center justify-between px-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

type NavigationBarDesktopLinksProps = {
  children: React.ReactNode;
  className?: string;
};
const NavigationBarDesktopLinks = React.forwardRef<
  HTMLUListElement,
  NavigationBarDesktopLinksProps
>((props, ref) => {
  const { children, className } = props;

  return (
    <NavigationMenu>
      <NavigationMenuList
        ref={ref}
        className={cn("hidden items-center gap-2 px-5 lg:flex", className)}
      >
        {children}
      </NavigationMenuList>
    </NavigationMenu>
  );
});

function NavigationBarLink(p: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  [key: string]: any; // Allow any additional props
}) {
  const { children, href, className, ...rest } = p;
  return (
    <NavigationMenuItem {...rest}>
      {href ? (
        <NavigationMenuLink
          className={cn(
            "text-inherit group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            navTransition,
            className,
          )}
          asChild
        >
          <Link href={href}>{children}</Link>
        </NavigationMenuLink>
      ) : (
        <NavigationMenuLink
          className={cn(
            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            navTransition,
            "cursor-pointer",
            className,
          )}
        >
          {children}
        </NavigationMenuLink>
      )}
    </NavigationMenuItem>
  );
}

type NavigationBarLeftProps = {
  children: React.ReactNode;
  className?: string;
};
const NavigationBarLeft = React.forwardRef<
  HTMLDivElement,
  NavigationBarLeftProps
>((p, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center", p.className)}>
      {p.children}
    </div>
  );
});

const logoBaseStyles =
  "relative w-36 transition-[width] duration-300 ease-out motion-reduce:transition-none [&_svg]:transition-[fill] [&_svg]:duration-300 [&_svg]:ease-out motion-reduce:[&_svg]:transition-none";
const logoStickyStyles = "w-30";
function NavigationBarLogo(p: {
  children: React.ReactNode;
  stickyClassName?: string;
  className?: string;
}) {
  const { stickyClassName = logoStickyStyles } = p;
  const sticky = useAtomValue(navStickyAtom);
  return (
    <a
      href="/"
      id="logo"
      className={cn(logoBaseStyles, p.className, sticky && stickyClassName)}
    >
      {p.children}
    </a>
  );
}

const baseHamburgerStyles =
  "w-8 h-1 relative transition-all duration-300 before:absolute before:w-8 before:h-1 before:bg-current before:left-0 before:transition-all before:duration-300 after:absolute after:w-8 after:h-1 after:bg-foreground after:left-0 after:transition-all after:duration-300";
const inactiveHamburgerStyles =
  "before:translate-y-[7px] after:translate-y-[-7px]";
const activeHamburgerStyles = "before:rotate-90 after:rotate-180 rotate-45";
type NavigationBarModalControlProps = {
  classNameActive?: string;
  classNameInavtive?: string;
  btnClassName?: string;
};
const NavigationBarModalControl = React.forwardRef<
  HTMLButtonElement,
  NavigationBarModalControlProps
>((p, ref) => {
  const [modelActive, setModelActive] = useAtom(modelActiveAtom);
  const {
    classNameActive = activeHamburgerStyles,
    classNameInavtive = inactiveHamburgerStyles,
  } = p;
  return (
    <nav id="model" className="h-full lg:hidden">
      <button
        ref={ref}
        onClick={() => setModelActive(!modelActive)}
        className={cn(
          "h-full w-full cursor-pointer focus:outline-none",
          p.btnClassName,
        )}
      >
        <div
          className={cn(
            baseHamburgerStyles,
            modelActive ? classNameActive : classNameInavtive,
          )}
        ></div>
      </button>
    </nav>
  );
});

const baseNavigationBarModelStyles =
  "fixed border-t border-border bg-card w-full min-h-[calc(100vh-50px)] transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none overflow-scroll";
type NavigationBarModelProps = {
  className?: string;
  children: React.ReactNode;
};
const NavigationBarModel = React.forwardRef<
  HTMLElement,
  NavigationBarModelProps
>((p, ref) => {
  const modelActive = useAtomValue(modelActiveAtom);

  return (
    <nav
      ref={ref}
      className={
        modelActive
          ? cn(baseNavigationBarModelStyles, p.className, "translate-x-0")
          : cn(
              baseNavigationBarModelStyles,
              p.className,
              "invisible translate-x-[-100vw]",
            )
      }
    >
      <div>{p.children}</div>
    </nav>
  );
});

export const navigationBarModelLinkBaseStyles =
  "hover:bg-muted text-xl w-full py-3 px-4 border-b border-border text-base";

// Type definition for props
type NavigationBarModelLinkProps = {
  className?: string;
  children: React.ReactNode;
  href: string;
};

const NavigationBarModelLink = React.forwardRef<
  HTMLDivElement,
  NavigationBarModelLinkProps
>((p, ref) => {
  const setModelActive = useSetAtom(modelActiveAtom);
  return (
    <Link href={p.href} onClick={() => setModelActive(false)}>
      <div
        ref={ref}
        className={cn(navigationBarModelLinkBaseStyles, p.className)}
      >
        {p.children}
      </div>
    </Link>
  );
});

export {
  NavigationBar,
  NavigationBarLeft,
  NavigationBarLink,
  NavigationBarLogo,
  NavigationBarModel,
  NavigationBarDesktopLinks,
  NavigationBarContent,
  NavigationBarModelLink,
  NavigationBarModalControl,
};
