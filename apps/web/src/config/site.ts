import { Pattern } from "@/lib/utils/clientUtils";

type SiteConfig = {
  production: {
    domain: string;
    url: string;
  };
  seo: {
    siteName: string;
    defaults: {
      pageDescription: string;
      category: string;
      robots: {
        index: boolean;
        follow: boolean;
        googleBot: {
          index: boolean;
          follow: boolean;
        };
      };

      twitterImg: string;
      openGraphImg: string;
    };
  };
  constructionPages: Pattern[];
};

export const siteConfig: SiteConfig = {
  production: {
    url: "https://prepbun.com",
    domain: "prepbun.com",
  },
  seo: {
    siteName: "Prepbun",
    defaults: {
      pageDescription:
        "SAT prep services geared toward college admissions and scholarships.",
      category: "education",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      twitterImg: "/social-cover.jpeg",
      openGraphImg: "/social-cover.jpeg",
    },
  },
  constructionPages: ["/blob"],
};
