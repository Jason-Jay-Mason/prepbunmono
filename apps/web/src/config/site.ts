import { Pattern } from "@/lib/utils/clientUtils";

type SiteConfig = {
  production: {
    domain: string;
    url: string;
  };
  auth: {
    saltRounds: number;
    refreshTtl: number;
    accessTtl: number;
    maxLoginAttempts: number;
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
    url: "https://www.prepbun.com",
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
  auth: {
    saltRounds: 10,
    refreshTtl: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    accessTtl: 15 * 60 * 1000, // 15 minutes in milliseconds
    maxLoginAttempts: 7,
  },
  constructionPages: ["/construction"],
};
