"use client";

import { navAbsoluteAtom } from "@/lib/ui/NavigationBar";
import { useSetAtom } from "jotai";

export const NavControl: React.FC<{ isAbsolute: boolean }> = ({
  isAbsolute,
}) => {
  const setAbsolute = useSetAtom(navAbsoluteAtom);
  setAbsolute(isAbsolute);
  return <></>;
};
