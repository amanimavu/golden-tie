// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // SSG: every page is prerendered to HTML at build time. The adapter
  // still runs a Worker for the few routes that opt out with
  // `export const prerender = false` — the contact action and the
  // /cms-asset image proxy.
  output: "static",

  // Remote hosts <Image> may fetch + optimise at build. Program images are
  // Directus files pulled from here. Keep this in sync with DIRECTUS_URL —
  // add the production CMS host before deploying.
  image: {
      remotePatterns: [
          { protocol: "http", hostname: "goldentiecms.local" },
          { protocol: "https", hostname: "cms.goldentie.africa" },
          // Dummy blog covers in local dev (getPosts fallback).
          { protocol: "https", hostname: "picsum.photos" },
      ],
  },

  // `compile`: optimise <Image>/<Picture> assets with Sharp at build time
  // and emit them as static files, so prerendered pages have no runtime
  // /_image dependency on the Worker.
  adapter: cloudflare({ imageService: "compile" }),

  site: "https://goldentie.africa",
  integrations: [sitemap()],
});