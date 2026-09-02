// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    // SSG: every page is prerendered to HTML at build time. The adapter
    // still runs a Worker for the few routes that opt out with
    // `export const prerender = false` — the contact action and the
    // /cms-asset image proxy.
    output: "static",
    adapter: cloudflare(),
    site: "https://goldentie.africa",
});
