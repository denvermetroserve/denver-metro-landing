import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Safe readiness check: never calls ServeManager or reveals credentials.
 * Useful for Vercel health probes and verifying that the integration is wired.
 */
export function GET() {
	return NextResponse.json({
		service: "servemanager",
		configured: Boolean(process.env.SERVEMANAGER_API_KEY),
		webhookConfigured: Boolean(process.env.SERVEMANAGER_WEBHOOK_SECRET),
	});
}
