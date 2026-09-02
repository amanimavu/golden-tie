import { env } from "cloudflare:workers";

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
    return env.DIRECTUS_API_KEY
        ? { Authorization: `Bearer ${env.DIRECTUS_API_KEY}` }
        : undefined;
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
    try {
        if (!env.DIRECTUS_URL) return devFallback(DUMMY_POSTS) ?? [];

        const url = new URL("/items/posts", env.DIRECTUS_URL);
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

export function coverImageUrl(post: Post): string | null {
    if (!post.cover_image) return null;
    // Absolute URL (legacy / dummy data) — use as-is.
    if (post.cover_image.startsWith("http")) return post.cover_image;
    // Directus file UUID — served via the /cms-asset proxy so the API token
    // stays server-side and CMS files can remain non-public.
    return `/cms-asset/${post.cover_image}`;
}
