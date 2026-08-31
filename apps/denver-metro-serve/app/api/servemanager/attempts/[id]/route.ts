import { proxyServeManager } from "@/app/api/servemanager/[...resource]/route";
import type { NextRequest } from "next/server";

async function proxy(request: NextRequest, params: Promise<{ id: string }>) {
	return proxyServeManager(request, ["attempts", (await params).id]);
}
export const GET = (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => proxy(request, params);
export const PUT = GET;
export const DELETE = GET;
