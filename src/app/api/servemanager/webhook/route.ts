import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function hasValidSignature(payload: string, supplied: string | null) {
	const secret = process.env.SERVEMANAGER_WEBHOOK_SECRET;
	if (!secret || !supplied) return false;
	const encodedPayload = Buffer.from(payload, "utf8").toString("base64");
	const expected = createHmac("sha256", secret)
		.update(encodedPayload)
		.digest("base64");
	const expectedBuffer = Buffer.from(expected, "utf8");
	const suppliedBuffer = Buffer.from(supplied, "utf8");
	return (
		expectedBuffer.length === suppliedBuffer.length &&
		timingSafeEqual(expectedBuffer, suppliedBuffer)
	);
}

export async function POST(request: Request) {
	const rawBody = await request.text();
	if (!hasValidSignature(rawBody, request.headers.get("x-sm-hmac-sha256"))) {
		return NextResponse.json(
			{ error: "Unauthorized webhook." },
			{ status: 401 },
		);
	}
	try {
		const payload = JSON.parse(rawBody);
		const eventCount = Array.isArray(payload?.data) ? payload.data.length : 0;
		console.info("ServeManager webhook accepted", {
			reference: payload?.meta?.reference,
			eventCount,
		});
		return NextResponse.json({ received: true });
	} catch {
		return NextResponse.json(
			{ error: "Invalid JSON webhook payload." },
			{ status: 400 },
		);
	}
}
