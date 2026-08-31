import { proxyServeManager } from "@/app/api/servemanager/[...resource]/route";
import type { NextRequest } from "next/server";

async function proxy(request: NextRequest, params: Promise<{ id: string }>) {
	return proxyServeManager(request, ["webhooks", (await params).id]);
}
export const PUT = (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => proxy(request, params);
export const DELETE = PUT;
