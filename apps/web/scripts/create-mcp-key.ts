/**
 * One-off: creates an MCP API key in payload-mcp-api-keys bound to an
 * existing user, with access scoped to the mcpPlugin capabilities.
 * The key is printed once (it is not readable after creation).
 *
 * Usage: bun scripts/create-mcp-key.ts [label]
 */
import { getPayload } from "payload";
import { randomBytes } from "crypto";
import config from "../src/payload.config";

const label = process.argv[2] ?? "opencode";

const payload = await getPayload({ config });

const users = await payload.find({ collection: "users", limit: 1 });
const user = users.docs[0];
if (!user) {
  console.error("No users found");
  process.exit(1);
}

// v3.90 redacts generated keys even on create, so supply our own.
const apiKey = `mcp-${randomBytes(24).toString("hex")}`;

const key = await payload.create({
  collection: "payload-mcp-api-keys",
  data: {
    user: user.id,
    apiKey,
    label,
    description: "MCP access for opencode CLI (copy editing)",
    pages: { find: true, update: true },
    media: { find: true },
    sitenav: { find: true, update: true },
  },
  overrideAccess: true,
});

console.log(`\nMCP API key for user ${user.email} (${label}):\n`);
console.log(apiKey);
process.exit(0);
