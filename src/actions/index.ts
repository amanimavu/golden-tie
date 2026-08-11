import { env } from "cloudflare:workers";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export const server = {
    contact: defineAction({
        accept: "form",
        input: z.object({
            name: z.string().trim().min(1, "Name is required").max(120),
            email: z.email("Enter a valid email address"),
            message: z
                .string()
                .trim()
                .min(1, "Message is required")
                .max(4000, "Message must be 4000 characters or fewer"),
            // Honeypot — real visitors never fill this in (it's visually
            // hidden). Any value here means it's a bot; pretend success so
            // it doesn't learn to look for a rejection response.
            company: z.string().max(200, "Unexpected input").optional(),
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
                    from: `Golden Tie Website <${env.CONTACT_FROM_EMAIL}>`,
                    to: env.CONTACT_TO_EMAIL,
                    reply_to: `${input.name} <${input.email}>`,
                    subject: `New message from ${input.name} — Golden Tie website`,
                    text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
                    html: `<p><strong>Name:</strong> ${escapeHtml(input.name)}</p><p><strong>Email:</strong> ${escapeHtml(input.email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>`,
                }),
            });

            if (!res.ok) {
                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message:
                        "Could not send your message. Please try again later.",
                });
            }

            return { ok: true };
        },
    }),
};
