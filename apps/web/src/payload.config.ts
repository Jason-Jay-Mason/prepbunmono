import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { env } from "./config/env";
import { Users } from "./lib/payload/collections/Users";
import { Pages } from "./lib/payload/collections/Pages";
import { Media } from "./lib/payload/collections/Media";
import { SiteNav } from "./lib/payload/globals/siteNav";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor({}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages],
  secret: env.PAYLOAD_SECRET || "",
  globals: [SiteNav],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // database-adapter-config-start
  db: postgresAdapter({
    pool: {
      connectionString: env.PAYLOAD_DATABASE_URI_DEV,
    },
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
