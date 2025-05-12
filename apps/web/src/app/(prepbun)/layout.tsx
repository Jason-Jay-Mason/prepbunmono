import React from "react";
import "./styles.css";
import { getPayload } from "payload";
import config from "@/payload.config";
import { SiteLayout } from "@/lib/components/site/Layout";
import { VideoOverlay } from "@/lib/ui/VideoOverlat";

const Layout: React.FC<any> = async ({ children }) => {
  const p = await getPayload({ config });
  const sitenav = await p.findGlobal({
    slug: "sitenav",
  });

  return (
    <html lang="en" className="">
      <body className="relative">
        <VideoOverlay />
        <SiteLayout nav={sitenav}>
          <main className="z-10 min-h-[75dvh]">{children}</main>
        </SiteLayout>
      </body>
    </html>
  );
};

export default Layout;
