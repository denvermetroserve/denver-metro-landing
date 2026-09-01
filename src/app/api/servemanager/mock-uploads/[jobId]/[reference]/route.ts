import { isServeManagerMockMode } from "@/lib/servemanager/mock";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(request: Request) {
	if (!isServeManagerMockMode()) {
		return NextResponse.json({ error: "Not found." }, { status: 404 });
	}
	const bytes = await request.arrayBuffer();
	if (!bytes.byteLength) {
		return NextResponse.json(
			{ error: "A document is required." },
			{ status: 400 },
		);
	}
	// Mock mode intentionally discards file bytes. It validates the same browser
	// upload handoff without storing legal documents outside ServeManager.
	return new NextResponse(null, { status: 204 });
}
