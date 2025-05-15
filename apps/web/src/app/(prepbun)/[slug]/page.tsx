import { getPayload } from "payload";
import { notFound } from "next/navigation";
import config from "@/payload.config";
import { draftMode } from "next/headers";
import { getErr } from "@/lib/error/utils";
import { payloadUtil } from "@/lib/payload/utils";
import { siteConfig } from "@/config/site";
import { isSimpleWildCardMatch } from "@/lib/utils";
import { MessagePage } from "@/lib/components/site/MessagePage";
import { PayloadPage } from "@/lib/components/site/PayloadPage";
import { NavControl } from "@/lib/components/site/NavControl";

export const dynamic = "force-static";
export default async function Page(p: any) {
  const { slug } = await p.params;

  let isUnderConstruction = false;
  for (let i = 0; i < siteConfig.constructionPages.length; i++) {
    let match = isSimpleWildCardMatch(
      `/${slug || ""}`,
      siteConfig.constructionPages[i],
    );
    if (match) {
      isUnderConstruction = match;
      break;
    }
  }
  if (isUnderConstruction) {
    return (
      <MessagePage
        headline="We're Building"
        blurb="This part of the site is under construction. Prepare to have your mind blown..."
        videoSrc="https://res.cloudinary.com/daki5cwn0/video/upload/v1744836872/mindblowwn_ko7hhm.mov"
      />
    );
  }

  if (slug === "home") return notFound();
  const draft = await draftMode();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "pages",
    draft: draft.isEnabled,
    limit: 1,
    where: {
      slug: { equals: slug || "home" },
    },
  });

  let pageNotCreated = docs.length < 1;
  if (pageNotCreated) return notFound();

  const page = docs[0];

  return (
    <>
      <NavControl isAbsolute={page.absoluteNav || false}></NavControl>
      <PayloadPage page={page} isDraft={draft.isEnabled} />
    </>
  );
}

export const generateMetadata = async ({ params }: any) => {
  try {
    const { slug } = await params;
    const payload = await getPayload({ config });
    const draft = await draftMode();
    const { docs } = await payload.find({
      collection: "pages",
      draft: draft.isEnabled,
      limit: 1,
      where: {
        slug: { equals: slug || "home" },
      },
    });
    let pageNotCreated = docs.length < 1;
    if (pageNotCreated) return;
    const meta = payloadUtil.mapSeoToMeta(docs[0]);
    return meta;
  } catch (e) {
    let err = getErr(e);
    console.error(err);
    return notFound();
  }
};

export async function generateStaticParams() {
  const payload = await getPayload({ config });

  const pagesRes = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    limit: 100,
  });

  const pages = pagesRes?.docs;

  return pages
    .filter((p) => p.slug !== "home")
    .map((p) => ({
      slug: p.slug,
    }));
}
