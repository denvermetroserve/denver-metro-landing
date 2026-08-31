const targetUrl = process.env.SERVEMANAGER_WEBHOOK_TARGET_URL?.trim();
const apiKey = process.env.SERVEMANAGER_API_KEY?.trim();
if (!targetUrl) {
	throw new Error(
		"SERVEMANAGER_WEBHOOK_TARGET_URL must be the deployed /api/servemanager/webhook URL.",
	);
}
if (!apiKey) throw new Error("SERVEMANAGER_API_KEY is required.");

const response = await fetch("https://www.servemanager.com/api/webhooks", {
	method: "POST",
	headers: {
		Accept: "application/json",
		Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		data: {
			type: "webhook",
			name: "Denver Metro Serve operational sync",
			client_reference_key: "denver-metro-serve-operational-sync",
			target_url: targetUrl,
			batch_interval_in_seconds: 60,
			enabled: true,
			events: [
				"jobs:created",
				"jobs:updated",
				"attempts:created",
				"attempts:updated",
				"notes:created",
				"notes:updated",
				"documents:created",
				"documents:updated",
				"affidavits:signed",
				"invoices:created",
				"invoices:updated",
				"invoices:issued",
			],
		},
	}),
});
if (!response.ok)
	throw new Error(
		`ServeManager webhook setup failed (${response.status}): ${await response.text()}`,
	);
const payload = await response.json();

console.log(
	JSON.stringify(
		{
			webhook: payload.data,
			message:
				"Store the returned secret_key as SERVEMANAGER_WEBHOOK_SECRET in Vercel; do not commit it.",
		},
		null,
		2,
	),
);
