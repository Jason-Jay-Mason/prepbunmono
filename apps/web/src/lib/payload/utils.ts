import { siteConfig } from "@/config/site";
import { Page } from "@/payload-types";
import type { Metadata } from "next";

type Util = {
  mapSeoToMeta: (p: Page) => Metadata;
};

export const payloadUtil: Util = {
  mapSeoToMeta: (p) => {
    const s = p.seo;
    const meta: Metadata = {
      title: {
        template: s.title || siteConfig.seo.siteName,
        default: siteConfig.seo.siteName,
      },
      description: s?.description || siteConfig.seo.defaults.pageDescription,
      category: s?.category || siteConfig.seo.defaults.category,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      twitter: {
        card: "summary_large_image",
        title: s.twitter.title || siteConfig.seo.siteName,
        description: s?.description || siteConfig.seo.defaults.pageDescription,
        images: [s?.twitter?.image.url || siteConfig.seo.defaults.twitterImg],
      },
      openGraph: {
        title: s?.openGraph?.title || siteConfig.seo.siteName,
        description:
          s?.openGraph?.description || siteConfig.seo.defaults.pageDescription,
        url: siteConfig.production.url,
        siteName: siteConfig.seo.siteName,
        images: [
          {
            url:
              s?.openGraph?.image.url || siteConfig.seo.defaults.openGraphImg,
            width: 1200,
            height: 630,
            alt: s?.openGraph?.alt || siteConfig.seo.siteName,
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
    if (s?.title) {
      meta.title = {
        template: siteConfig.seo.siteName,
        default: `%s | ${siteConfig.seo.siteName}`,
        absolute: s?.title,
      };
    }
    return meta;
  },
};
