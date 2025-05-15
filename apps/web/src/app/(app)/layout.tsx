import React from "react";
import "../(prepbun)/styles.css";
import { VideoOverlay } from "@/lib/ui/VideoOverlat";

const Layout: React.FC<any> = async ({ children }) => {
  return (
    <html lang="en" className="">
      <body className="relative">
        <VideoOverlay />
        <main className="z-10 min-h-[75dvh] bg-background">{children}</main>
      </body>
    </html>
  );
};

export default Layout;
