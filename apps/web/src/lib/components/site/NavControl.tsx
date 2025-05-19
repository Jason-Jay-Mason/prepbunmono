"use client";

import { navAbsoluteAtom } from "@/lib/ui/NavigationBar";
import { useSetAtom } from "jotai";
import { useLayoutEffect } from "react";

export const NavControl: React.FC<{ isAbsolute: boolean }> = ({
  isAbsolute,
}) => {
  const setAbsolute = useSetAtom(navAbsoluteAtom);

  useLayoutEffect(() => {
    setAbsolute(isAbsolute);
  }, [isAbsolute, setAbsolute]);

  return <></>;
};
