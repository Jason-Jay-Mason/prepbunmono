import React from "react";
import "./styles.css";
import { getPayload } from "payload";
import config from "@/payload.config";
import { SiteLayout } from "@/lib/components/site/Layout";
import { VideoOverlay } from "@/lib/ui/VideoOverlat";
import { Hubspot } from "@/lib/hubspot/scripts";
import { PostHogProvider } from "@/lib/posthog/provider";

const Layout: React.FC<any> = async ({ children }) => {
  const p = await getPayload({ config });
  const sitenav = await p.findGlobal({
    slug: "sitenav",
  });

  return (
    <html lang="en" className="">
      <body className="relative">
        <PostHogProvider>
          <VideoOverlay />
          <SiteLayout nav={sitenav}>
            <main className="z-10 min-h-[75dvh] bg-background">{children}</main>
          </SiteLayout>
          <Hubspot />
        </PostHogProvider>
      </body>
    </html>
  );
};

export default Layout;
