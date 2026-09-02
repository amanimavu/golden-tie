import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

// Proxy for Directus file assets. The browser hits /cms-asset/<uuid>; this
// route fetches the file from Directus with the API token attached, so the
// token never reaches the client and the CMS `directus_files` collection can
// stay non-public. Directus keeps a file's UUID across replacements, so the
// URL is stable.
export const prerender = false;

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Directus image-transform query params allowed through to /assets. `key`
// is a named transform preset; the rest are ad-hoc.
const PASS_PARAMS = ["width", "height", "fit", "quality", "format", "key"];

export const GET: APIRoute = async ({ params, request }) => {
	const id = params.id ?? "";
	if (!UUID_RE.test(id)) return new Response("Not found", { status: 404 });
	if (!env.DIRECTUS_URL) return new Response("Not configured", { status: 500 });

	const upstream = new URL(`/assets/${id}`, env.DIRECTUS_URL);
	const reqUrl = new URL(request.url);
	for (const key of PASS_PARAMS) {
		const value = reqUrl.searchParams.get(key);
		if (value) upstream.searchParams.set(key, value);
	}

	const forwarded = new Headers();
	if (env.DIRECTUS_API_KEY) {
		forwarded.set("authorization", `Bearer ${env.DIRECTUS_API_KEY}`);
	}
	// Pass conditional / range requests through so caching and seeking work.
	for (const header of ["range", "if-none-match", "if-modified-since"]) {
		const value = request.headers.get(header);
		if (value) forwarded.set(header, value);
	}

	let res: Response;
	try {
		res = await fetch(upstream, { headers: forwarded });
	} catch {
		return new Response("Bad gateway", { status: 502 });
	}

	if (res.status >= 400) {
		return new Response("Not found", {
			status: res.status === 404 ? 404 : 502,
		});
	}

	const headers = new Headers();
	for (const header of [
		"content-type",
		"content-length",
		"content-range",
		"accept-ranges",
		"etag",
		"last-modified",
	]) {
		const value = res.headers.get(header);
		if (value) headers.set(header, value);
	}
	headers.set("cache-control", "public, max-age=3600, s-maxage=86400");

	return new Response(res.status === 304 ? null : res.body, {
		status: res.status,
		headers,
	});
};
