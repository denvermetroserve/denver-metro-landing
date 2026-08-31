import { proxyServeManager } from "@/app/api/servemanager/[...resource]/route";
import type { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return proxyServeManager(request, ["employees", (await params).id]);
}
