// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig } from "astro/config";

// A static site: Cloudflare Pages publishes dist/ as it is, with no adapter
// and no functions.
export default defineConfig({
  site: "https://xunhen.org",
  // Release notes keep the straight quotes CHANGELOG.md has.
  markdown: {
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  // Stylesheets and scripts stay files rather than inline blocks, so the
  // Content-Security-Policy in public/_headers can allow only 'self'.
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
