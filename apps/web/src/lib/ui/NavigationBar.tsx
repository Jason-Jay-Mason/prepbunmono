import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useScrollPosition, useWindowSize } from "@/lib/hooks";
import { navigationMenuTriggerStyle } from "./shadcn/navigation-menu";

//Global state opinions suck in react and I loath them, it is useful sometimes for reuseability; I bring in atom for global client side state so we don't have to deal with context
export const modelActiveAtom = atom(false);
export const navStickyAtom = atom(false);
export const navAbsoluteAtom = atom(true);

const baseNavBarStyles =
  "border-b border-transparent w-full sticky top-0 transition-all z-[100]";
function NavigationBar(p: {
  children: React.ReactNode;
  spacerClassName?: string;
  className?: string;
}) {
  const [absolute, setAbsolute] = useAtom(navAbsoluteAtom);
  const [modelActive, setModelActive] = useAtom(modelActiveAtom);
  const [sticky, setSticky] = useAtom(navStickyAtom);
  const windowSize = useWindowSize();
  const [fromTop, _] = useScrollPosition();
  const [lastScroll, setLastScroll] = useState<number>(-1);
  const spacerRef = useRef<HTMLDivElement>(null);

  const threshold = 200;

  const hidden = useMemo(() => {
    if (modelActive) return false;
    const isDown = lastScroll < fromTop;
    const thresholdReached = threshold < fromTop;
    return isDown && thresholdReached;
  }, [fromTop, modelActive]);

  useEffect(() => {
    const sticky = spacerRef.current?.offsetHeight! < fromTop || false;
    setSticky(sticky);
    setLastScroll(fromTop);
  }, [fromTop, modelActive]);

  useEffect(() => {
    setModelActive(false);
  }, [windowSize]);

  return (
    <>
      <div
        ref={spacerRef}
        className={cn("hidden h-5 lg:block bg-foreground", p.spacerClassName)}
      ></div>
      <header
        className={cn(
          baseNavBarStyles,
          hidden ? "-translate-y-full transform" : "translate-y-0",
          absolute ? "lg:-mb-[60px]" : "mb-0",

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
        <Link href={href} legacyBehavior passHref>
          <NavigationMenuLink
            className={cn(
              "text-inherit group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
              className,
            )}
          >
            {children}
          </NavigationMenuLink>
        </Link>
      ) : (
        <NavigationMenuLink
          className={cn(
            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
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

const logoBaseStyles = "relative w-36 transition-all";
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
  "fixed border-t border-border bg-card w-full h-[calc(100vh-50px)] transition-all";
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
      {p.children}
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
