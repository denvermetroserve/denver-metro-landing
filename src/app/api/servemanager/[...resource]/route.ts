import { timingSafeEqual } from "node:crypto";
import {
	ServeManagerError,
	serveManagerRequest,
} from "@/lib/servemanager/client";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ resource: string[] }> };

const topLevelResources = new Set([
	"account",
	"employees",
	"companies",
	"court_cases",
	"courts",
	"jobs",
	"attempts",
	"invoices",
	"notes",
	"webhooks",
]);
const nestedJobResources = new Set([
	"attempts",
	"notes",
	"uploads",
	"invoices",
]);
const identifier = /^\d+$/;
const webhookIdentifier = /^[0-9a-f-]{16,}$/i;

function hasInternalAccess(request: NextRequest) {
	const expected = process.env.SERVEMANAGER_INTERNAL_API_TOKEN;
	const supplied = request.headers
		.get("authorization")
		?.replace(/^Bearer\s+/i, "")
		.trim();
	if (!expected || !supplied) return false;
	const expectedBuffer = Buffer.from(expected);
	const suppliedBuffer = Buffer.from(supplied);
	return (
		expectedBuffer.length === suppliedBuffer.length &&
		timingSafeEqual(expectedBuffer, suppliedBuffer)
	);
}

function isAllowedResourcePath(resource: string[]) {
	const [topLevel, id, nested] = resource;
	if (!topLevelResources.has(topLevel)) return false;
	if (resource.length === 1) return true;
	if (topLevel === "account") return false;
	if (topLevel === "webhooks")
		return Boolean(id && webhookIdentifier.test(id) && resource.length === 2);
	if (!id || !identifier.test(id)) return false;
	if (resource.length === 2) return true;
	return (
		topLevel === "jobs" &&
		resource.length === 3 &&
		Boolean(nested && nestedJobResources.has(nested))
	);
}

export async function proxyServeManager(
	request: NextRequest,
	resource: string[],
) {
	if (!hasInternalAccess(request))
		return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
	if (!isAllowedResourcePath(resource)) {
		return NextResponse.json(
			{ error: "Unsupported ServeManager resource." },
			{ status: 404 },
		);
	}
	try {
		const body = ["POST", "PUT", "PATCH"].includes(request.method)
			? await request.text()
			: undefined;
		if (body && body.length > 1_000_000)
			return NextResponse.json(
				{ error: "Payload too large." },
				{ status: 413 },
			);
		if (body) {
			try {
				JSON.parse(body);
			} catch {
				return NextResponse.json(
					{ error: "JSON request body required." },
					{ status: 406 },
				);
			}
		}
		const payload = await serveManagerRequest<unknown>(
			`/api/${resource.join("/")}${request.nextUrl.search}`,
			{
				method: request.method,
				...(body ? { body } : {}),
			},
		);
		return NextResponse.json(payload, {
			status: request.method === "DELETE" ? 204 : 200,
		});
	} catch (error) {
		console.error("ServeManager gateway request failed", error);
		if (error instanceof ServeManagerError)
			return NextResponse.json(
				{ error: error.message, details: error.details },
				{ status: error.status },
			);
		return NextResponse.json(
			{ error: "ServeManager request failed." },
			{ status: 500 },
		);
	}
}

async function proxy(request: NextRequest, context: RouteContext) {
	const { resource } = await context.params;
	return proxyServeManager(request, resource);
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
