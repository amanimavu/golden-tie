import { env } from "cloudflare:workers";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
	contact: defineAction({
		accept: "form",
		input: z.object({
			name: z.string().trim().min(1, "Name is required").max(120),
			email: z.string().trim().email("Enter a valid email address"),
			message: z.string().trim().min(1, "Message is required").max(4000),
			// Honeypot — real visitors never fill this in (it's visually
			// hidden). Any value here means it's a bot; pretend success so
			// it doesn't learn to look for a rejection response.
			company: z.string().max(200).optional(),
		}),
		handler: async (input) => {
			if (input.company) {
				return { ok: true };
			}

			const res = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.RESEND_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					from: env.CONTACT_FROM_EMAIL,
					to: env.CONTACT_TO_EMAIL,
					reply_to: input.email,
					subject: `New message from ${input.name} — Golden Tie website`,
					text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
				}),
			});

			if (!res.ok) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Could not send your message. Please try again later.",
				});
			}

			return { ok: true };
		},
	}),
};
