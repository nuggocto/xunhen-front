import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One Markdown file per release, copied from the application's CHANGELOG.md
// for a published tag; "unreleased" holds notes not yet in a release. The
// body groups notes under ### Added, Changed, Fixed, Removed, Deprecated,
// and Security, with only the headings that have entries.
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;

const changelog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/changelog" }),
  schema: z
    .object({
      version: z.union([z.literal("unreleased"), z.string().regex(semver)]),
      date: z.coerce.date().optional(),
      release: z.url().optional(),
    })
    .refine((entry) => (entry.version === "unreleased") === (entry.date === undefined), {
      message: "a released version needs its release date, and unreleased notes have none",
    }),
});

export const collections = { changelog };
