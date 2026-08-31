import { env } from "cloudflare:workers";

export interface Post {
	id: string;
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
	return env.DIRECTUS_TOKEN
		? { Authorization: `Bearer ${env.DIRECTUS_TOKEN}` }
		: undefined;
}

// Directus isn't provisioned yet. In dev, fall back to DUMMY_POSTS below so
// the template has something to render. In a real build (no DIRECTUS_URL
// configured), fall back to an empty/null result instead — never ship
// placeholder posts to production.
const DUMMY_POSTS: Post[] = [
	{
		id: "dummy-1",
		title: "Golden Tie launches biodiesel feedstock trading",
		slug: "golden-tie-launches-biodiesel-feedstock-trading",
		excerpt:
			"Our newest venture begins sourcing waste-oil feedstock for sustainable biodiesel production.",
		body: "<p>Sample body copy for template review. Replace with real Directus content once the collection is wired up.</p><h2>A subheading</h2><p>Paragraph text, an <a href=\"#\">example link</a>, and a short list:</p><ul><li>Sample point one</li><li>Sample point two</li></ul>",
		publish_date: "2026-06-01",
		cover_image: "https://picsum.photos/seed/golden-tie-1/800/800",
		tags: ["Announcements", "Energy"],
	},
	{
		id: "dummy-2",
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
		id: "dummy-3",
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

export async function getPosts(): Promise<Post[]> {
	if (!env.DIRECTUS_URL) return import.meta.env.DEV ? DUMMY_POSTS : [];

	const url = new URL("/items/posts", env.DIRECTUS_URL);
	url.searchParams.set("fields", POST_FIELDS);
	url.searchParams.set("filter[status][_eq]", "published");
	url.searchParams.set("sort", "-publish_date");

	const res = await fetch(url, { headers: headers() });
	if (!res.ok) return [];

	const { data } = (await res.json()) as { data: Post[] };
	return data;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	if (!env.DIRECTUS_URL) {
		return import.meta.env.DEV
			? (DUMMY_POSTS.find((post) => post.slug === slug) ?? null)
			: null;
	}

	const url = new URL("/items/posts", env.DIRECTUS_URL);
	url.searchParams.set("fields", POST_FIELDS);
	url.searchParams.set("filter[status][_eq]", "published");
	url.searchParams.set("filter[slug][_eq]", slug);
	url.searchParams.set("limit", "1");

	const res = await fetch(url, { headers: headers() });
	if (!res.ok) return null;

	const { data } = (await res.json()) as { data: Post[] };
	return data[0] ?? null;
}

export function coverImageUrl(post: Post): string | null {
	if (!post.cover_image) return null;
	if (post.cover_image.startsWith("http")) return post.cover_image;
	if (!env.DIRECTUS_URL) return null;
	return new URL(`/assets/${post.cover_image}`, env.DIRECTUS_URL).toString();
}
