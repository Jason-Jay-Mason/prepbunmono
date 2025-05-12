import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState<[number, number]>([
    0, 0,
  ]);

  const handleScroll = () => {
    const currentScrollPositionBtm = window.scrollY + window.innerHeight;
    const currentScrollPositionTop = window.scrollY;

    setScrollPosition([currentScrollPositionTop, currentScrollPositionBtm]);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Call once to set initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize, { passive: true });

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
