const getDirectusUrl = () => {
    return import.meta.env.DIRECTUS_URL || process.env.DIRECTUS_URL;
};

const getDirectusKey = () => {
    return import.meta.env.DIRECTUS_API_KEY || process.env.DIRECTUS_API_KEY;
};

export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    publish_date: string;
    cover_image: string | null;
    tags: string[];
}

const POST_FIELDS = [
    "id",
    "title",
    "slug",
    "excerpt",
    "body",
    "publish_date",
    "cover_image",
    "tags",
].join(",");

function headers(): HeadersInit | undefined {
    const key = getDirectusKey();

    return key ? { Authorization: `Bearer ${key}` } : undefined;
}

// DIRECTUS_URL is always set (wrangler.jsonc var). If it's ever missing, or
// a request fails, fall back to DUMMY_POSTS in dev so the template still
// renders — but never ship placeholder posts to production (return empty
// there instead).
const DUMMY_POSTS: Post[] = [
    {
        id: 1,
        title: "Golden Tie launches biodiesel feedstock trading",
        slug: "golden-tie-launches-biodiesel-feedstock-trading",
        excerpt:
            "Our newest venture begins sourcing waste-oil feedstock for sustainable biodiesel production.",
        body: '<p>Sample body copy for template review. Replace with real Directus content once the collection is wired up.</p><h2>A subheading</h2><p>Paragraph text, an <a href="#">example link</a>, and a short list:</p><ul><li>Sample point one</li><li>Sample point two</li></ul>',
        publish_date: "2026-06-01",
        cover_image: "https://picsum.photos/seed/golden-tie-1/800/800",
        tags: ["Announcements", "Energy"],
    },
    {
        id: 2,
        title: "Training Institute opens enrollment for new cohort",
        slug: "training-institute-opens-enrollment",
        excerpt:
            "Hands-on programs in hospitality, service, and entrepreneurship — applications now open.",
        body: "<p>Sample body copy for template review.</p><blockquote>Sample pull-quote styling.</blockquote><p>Closing paragraph.</p>",
        publish_date: "2026-05-12",
        cover_image: "https://picsum.photos/seed/golden-tie-2/800/800",
        tags: ["Education"],
    },
    {
        id: 3,
        title: "Tipping App crosses first milestone",
        slug: "tipping-app-first-milestone",
        excerpt:
            "An early update on adoption of the digital tipping platform among service staff.",
        body: "<p>Sample body copy for template review.</p>",
        publish_date: "2026-04-03",
        cover_image: "https://picsum.photos/seed/golden-tie-3/800/800",
        tags: ["Fintech"],
    },
];

// Only a *failed request* (missing URL, network error, non-OK response)
// falls back to DUMMY_POSTS, and only in dev, so the template still renders
// when Directus is down. A successful-but-empty response is a real result:
// empty list / 404, in dev and prod alike.
const devFallback = <T>(value: T): T | null =>
    import.meta.env.DEV ? value : null;

export async function getPosts(): Promise<Post[]> {
    const baseUrl = getDirectusUrl();

    try {
        if (!baseUrl) return devFallback(DUMMY_POSTS) ?? [];

        const url = new URL("/items/posts", baseUrl);
        url.searchParams.set("fields", POST_FIELDS);
        // The `posts` collection has no Directus `status` field — `archived`
        // (boolean) is the publish gate.
        url.searchParams.set("filter[archived][_eq]", "false");
        url.searchParams.set("sort", "-publish_date");

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return devFallback(DUMMY_POSTS) ?? [];

        const { data } = (await res.json()) as { data: Post[] };
        return data;
    } catch {
        return devFallback(DUMMY_POSTS) ?? [];
    }
}

// --- Subsidiaries -----------------------------------------------------------

export interface Subsidiary {
    id: number;
    name: string;
    category: string;
    description: string;
    url: string | null;
}

const SUBSIDIARY_FIELDS = ["id", "name", "category", "description", "url"].join(
    ",",
);

const DUMMY_SUBSIDIARIES: Subsidiary[] = [
    {
        id: 1,
        name: "Tipping App",
        category: "Fintech — Digital Tipping",
        description:
            "A digital tipping platform connecting service staff with the customers they serve.",
        url: "https://play.google.com/store/apps/details?id=bsl.co.ke.briskapplication&hl=en",
    },
    {
        id: 2,
        name: "Biodiesel Feedstock Trader",
        category: "Energy — Feedstock Trading",
        description:
            "Sourcing and trading waste-oil feedstock for sustainable biodiesel production.",
        url: "https://biodiesel.goldentie.africa",
    },
    {
        id: 3,
        name: "Training Institute",
        category: "Education — Skills Training",
        description:
            "Hands-on training programs building skills for hospitality, service, and entrepreneurship.",
        url: null,
    },
];

// Unlike posts, subsidiaries are structural page content — the homepage must
// never render an empty section. So this falls back to DUMMY_SUBSIDIARIES in
// *every* environment (missing URL, request failure, or a collection that
// exists but has no rows). Once the CMS `subsidiaries` collection is created
// and populated, its rows win. Delete the fallback once the CMS is the hard
// source of truth.
export async function getSubsidiaries(): Promise<Subsidiary[]> {
    const baseUrl = getDirectusUrl();
    try {
        if (!baseUrl) return DUMMY_SUBSIDIARIES;

        const url = new URL("/items/subsidiaries", baseUrl);
        url.searchParams.set("fields", SUBSIDIARY_FIELDS);
        // `archived` (boolean) is the publish gate, same convention as posts.
        url.searchParams.set("filter[archived][_eq]", "false");
        // Creation order by default. Add a `sort` field to the collection and
        // change this to "sort" for manual drag-ordering in the Data Studio.
        url.searchParams.set("sort", "id");

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return DUMMY_SUBSIDIARIES;

        const { data } = (await res.json()) as { data: Subsidiary[] };
        return data.length > 0 ? data : DUMMY_SUBSIDIARIES;
    } catch {
        return DUMMY_SUBSIDIARIES;
    }
}

// --- CSR programs ---------------------------------------------------------

export interface Program {
    id: number;
    category: string;
    name: string;
    // May contain inline markup (e.g. <span class="hi">…</span>) — admin
    // authored, rendered with set:html, same trust model as post `body`.
    lead: string;
    description: string;
    // Directus file UUID, or null. Resolved to a full URL by
    // programImageUrl() and fed to <Image> as a remote source (optimised at
    // build — needs the CMS host in astro.config `image.remotePatterns` and
    // the file readable by the Public role).
    image: string | null;
    image_alt: string;
}

const PROGRAM_FIELDS = [
    "id",
    "category",
    "name",
    "lead",
    "description",
    "image",
    "image_alt",
].join(",");

// Fallback only — used when the CMS is unreachable or the `programs`
// collection has no rows. Text-only (no image) is acceptable for that
// degraded state; real rows carry an `image` UUID.
const DUMMY_PROGRAMS: Program[] = [
    {
        id: 1,
        category: "Environment — Reforestation",
        name: "Reforestation",
        lead: 'One tree planted for every <span class="hi">500&nbsp;kg</span> of oil we collect.',
        description:
            "Every batch of feedstock the biodiesel business takes in is tracked, and the running tally funds tree planting — so the more waste oil we divert, the more trees go in the ground.",
        image: null,
        image_alt: "Tree seedlings ready for planting",
    },
    {
        id: 2,
        category: "Environment — Waste Diversion",
        name: "Waste-Oil Collection",
        lead: "Used cooking oil, kept out of drains and landfill.",
        description:
            "Our Biodiesel Feedstock Trader business collects used cooking oil and other waste oils from restaurants and processors, moving them into cleaner fuel production rather than the environment.",
        image: null,
        image_alt: "Used cooking oil collected for processing",
    },
    {
        id: 3,
        category: "Education — Skills & Livelihoods",
        name: "Skills Training",
        lead: "Practical skills aimed at real, immediate work.",
        description:
            "Our Training Institute runs hands-on programs in hospitality, service, and entrepreneurship, built around employability rather than certificates alone.",
        image: null,
        image_alt: "Trainees in a hands-on session",
    },
];

// Structural page content like subsidiaries — the CSR page must never render
// an empty programs section, so this falls back to DUMMY_PROGRAMS in every
// environment. CMS rows win once the `programs` collection exists and has
// rows. Delete the fallback once the CMS is the hard source of truth.
export async function getPrograms(): Promise<Program[]> {
    const baseUrl = getDirectusUrl();
    try {
        if (!baseUrl) return DUMMY_PROGRAMS;

        const url = new URL("/items/programs", baseUrl);
        url.searchParams.set("fields", PROGRAM_FIELDS);
        url.searchParams.set("filter[archived][_eq]", "false");
        // Creation order by default. Add a `sort` field to the collection and
        // change this to "sort" for manual drag-ordering in the Data Studio.
        url.searchParams.set("sort", "id");

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return DUMMY_PROGRAMS;

        const { data } = (await res.json()) as { data: Program[] };
        return data.length > 0 ? data : DUMMY_PROGRAMS;
    } catch {
        return DUMMY_PROGRAMS;
    }
}

export interface Partner {
    id: number;
    name: string;
    url: string | null;
    logo: string;
}

// Raw row shape — `logo` is a Directus file UUID, resolved to a URL below.
interface DirectusPartner {
    id: number;
    name: string;
    url: string | null;
    logo: string | null;
}

const PARTNER_FIELDS = ["id", "name", "url", "logo"].join(",");

// The CMS `partners` collection is the only source. Returns [] on a missing
// URL, a failed request, a role without read access, or a collection with no
// usable rows — the caller hides the section entirely rather than rendering
// an empty one, since a heading with nothing under it reads as a bug.
export async function getPartners(): Promise<Partner[]> {
    const baseUrl = getDirectusUrl();
    if (!baseUrl) return [];

    try {
        const url = new URL("/items/partners", baseUrl);
        url.searchParams.set("fields", PARTNER_FIELDS);
        url.searchParams.set("filter[archived][_eq]", "false");
        url.searchParams.set("sort", "id");

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return [];

        const { data } = (await res.json()) as { data: DirectusPartner[] };

        // Drop rows with no file rather than rendering an empty tile.
        return data
            .filter((row) => row.logo)
            .map((row) => ({
                id: row.id,
                name: row.name,
                url: row.url,
                logo: new URL(`/assets/${row.logo}`, baseUrl).toString(),
            }));
    } catch {
        return [];
    }
}

// --- Hero (singleton) -------------------------------------------------------

// `hero` collection — the index page masthead. Fields:
//
//   id       integer  (auto PK)
//   archived boolean  (default false — the publish gate)
//   headline string   (the h1; defaults to the company name, which is also
//                     what the <title> tag and the footer wordmark use, so
//                     changing it here is an editorial choice, not a rename)
//   sub      string   (the tagline under the headline)
export interface Hero {
    id: number;
    headline: string;
    sub: string;
}

const HERO_FIELDS = ["id", "headline", "sub"].join(",");

// Dev-only fallback so a fresh clone renders a sensible hero before anyone has
// created the collection. Returns null in production rather than shipping the
// placeholder — the same split getPosts() uses for DUMMY_POSTS. The missing
// headline falls back to the company name in the caller, which is correct for
// both cases rather than being a dev-only artefact.
const DUMMY_HERO: Hero = {
    id: 1,
    headline: "Golden Tie Limited",
    sub: "A conglomerate with interests across Technology, Green energy and Education",
};

export async function getHero(): Promise<Hero | null> {
    const baseUrl = getDirectusUrl();
    if (!baseUrl) return devFallback(DUMMY_HERO);

    try {
        const url = new URL("/items/hero", baseUrl);
        url.searchParams.set("fields", HERO_FIELDS);

        // A singleton collection returns `data` as a single object, not an
        // array — indexing it (data[0]) yields undefined and silently reads as
        // "no content". Archived rows come back as null, which is why this
        // checks the value rather than the status.
        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return devFallback(DUMMY_HERO);

        const { data } = (await res.json()) as { data: Hero | null };
        if (!data?.sub) return devFallback(DUMMY_HERO);

        return { id: data.id, headline: data.headline, sub: data.sub };
    } catch {
        return devFallback(DUMMY_HERO);
    }
}

// --- About (singleton) ------------------------------------------------------

// `about` collection — a single row holding the homepage About copy. Fields:
//
//   id       integer  (auto PK)
//   archived boolean  (default false — the publish gate)
//   body     text     (rich copy — set the field's interface to
//                     "input-rich-text-html" for a WYSIWYG editor. The stored
//                     type stays `text`; rich text is an interface, not a
//                     type, matching posts.body. May contain
//                     <span class="accent"> wrappers around highlighted
//                     phrases, which .about styles)
//
// One row, addressed by collection name rather than by id. `heading` is
// deliberately not a field — "About" is the section's fixed identity, not copy
// an editor should be able to change.
export interface About {
    id: number;
    // Admin-authored HTML from the CMS's rich-text editor. Rendered with
    // set:html and *not* wrapped in a <p> — a rich-text value is a document
    // fragment that already carries its own block elements, and nesting those
    // inside a <p> is invalid markup that browsers silently restructure.
    // Same trust model as post `body` and program `lead`.
    body: string;
}

const ABOUT_FIELDS = ["id", "body"].join(",");

// Returns null on a missing URL, failed request, role without read access, or
// a collection with no rows — the caller omits the paragraph entirely rather
// than rendering an empty one.
export async function getAbout(): Promise<About | null> {
    const baseUrl = getDirectusUrl();
    if (!baseUrl) return null;

    try {
        const url = new URL("/items/about", baseUrl);
        url.searchParams.set("fields", ABOUT_FIELDS);
        // No filter or limit: a singleton collection is addressed by name, not
        // by row, so it ignores both. Applying them here would be misleading —
        // the response shape is decided by the singleton flag alone.

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return null;

        // A singleton collection returns `data` as a single object, not an
        // array — indexing it (data[0]) yields undefined and silently reads as
        // "no content". Archived rows come back as null, which is why this
        // checks the value rather than the status.
        const { data } = (await res.json()) as { data: About | null };
        if (!data?.body) return null;

        return { id: data.id, body: data.body };
    } catch {
        return null;
    }
}

// --- Interests --------------------------------------------------------------

// `interests` collection — the short list of industries under the About copy.
// Fields:
//
//   id       integer  (auto PK)
//   archived boolean  (default false — the publish gate)
//   name     string   (the label, e.g. "Green Energy")
//   sort     integer  (editors reorder by setting this; the query sorts on it)
export interface Interest {
    id: number;
    name: string;
}

const INTEREST_FIELDS = ["id", "name"].join(",");

// Returns [] on a miss, for the same reason getAbout() returns null: the caller
// renders no list rather than an empty one.
export async function getInterests(): Promise<Interest[]> {
    const baseUrl = getDirectusUrl();
    if (!baseUrl) return [];

    try {
        const url = new URL("/items/interests", baseUrl);
        url.searchParams.set("fields", INTEREST_FIELDS);
        url.searchParams.set("filter[archived][_eq]", "false");
        // Editors control order through the `sort` field; without one set it
        // falls back to creation order via id.
        url.searchParams.set("sort", "sort,id");

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) return [];

        const { data } = (await res.json()) as { data: Interest[] };
        return data
            .filter((row) => row.name)
            .map((row) => ({ id: row.id, name: row.name }));
    } catch {
        return [];
    }
}

// --- Assets ----------------------------------------------------------------

// Full Directus asset URL for a post cover. Fed to <Image> as a remote
// source: Astro fetches and Sharp-optimises it at build (same as program
// images). Requires the CMS host in astro.config `image.remotePatterns` and
// the file readable by the Directus Public role.
export function coverImageUrl(post: Post): string | null {
    const baseUrl = getDirectusUrl();
    if (!post.cover_image) return null;
    // Absolute URL (dummy data) — use as-is.
    if (post.cover_image.startsWith("http")) return post.cover_image;
    return new URL(`/assets/${post.cover_image}`, baseUrl).toString();
}

// Full Directus asset URL for a program image. Fed straight to <Image> as a
// remote source: Astro fetches and Sharp-optimises it at build. Requires the
// CMS host in astro.config `image.remotePatterns` and the file readable by
// the Directus Public role (build-time fetch carries no token).
export function programImageUrl(program: Program): string | null {
    if (!program.image) return null;
    const baseUrl = getDirectusUrl();
    return new URL(`/assets/${program.image}`, baseUrl).toString();
}
