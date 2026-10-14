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

    // Astro writes the policy into a <meta> tag in the <head> of every page.
    // We do it here rather than in public/_headers because Astro inlines some
    // CSS and JavaScript straight into the HTML, and the policy has to include a
    // fingerprint (a "hash") of each of those blocks. Those hashes change every
    // time the site is rebuilt, so they have to be generated rather than typed by
    // hand. Astro generates them for us; we just add the rules below.

    // Note: this only takes effect after a build. `npm run dev` does not apply it.
    security: {
        csp: {
            directives: [
                "default-src 'self'",
                "base-uri 'self'",
                "object-src 'none'",
                "frame-src 'none'",
                "worker-src 'none'",
                // Only the contact form may submit data, and only to this site.
                "form-action 'self'",
                "manifest-src 'self'",
                // The font files themselves come from fonts.gstatic.com. (The
                // stylesheet that points to them is allowed further down.)
                "font-src 'self' https://fonts.gstatic.com",
                // Images come from this site, or straight from the CMS when Directus
                // content includes one.
                "img-src 'self' data: https://cms.goldentie.africa",
                // The only background request the site makes is the contact form.
                "connect-src 'self'",
                "upgrade-insecure-requests",
            ],
            styleDirective: {
                resources: [
                    // Both of these need "'self'" repeated because a browser stops
                    // looking at the general style-src rule as soon as style-src-elem
                    // exists. Without it our own bundled CSS would be blocked.
                    { resource: "'self'", kind: "element" },
                    // Google Fonts, linked from BaseLayout.
                    {
                        resource: "https://fonts.googleapis.com",
                        kind: "element",
                    },
                    // NoiseReveal sets --nr-size/--nr-dark with a style attribute, which
                    // cannot be fingerprinted like the rest. Scoped to style attributes
                    // only, so inline <style> blocks stay blocked.
                    { resource: "'unsafe-inline'", kind: "attribute" },
                ],
            },
        },
    },
});
