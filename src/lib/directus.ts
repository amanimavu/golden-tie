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

    console.log(
        "CI Build Check - DIRECTUS_URL:",
        baseUrl ? "Found" : "Missing",
    );
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
