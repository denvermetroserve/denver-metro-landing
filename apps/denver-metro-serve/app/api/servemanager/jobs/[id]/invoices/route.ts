import { proxyServeManager } from "@/app/api/servemanager/[...resource]/route";
import type { NextRequest } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return proxyServeManager(request, ["jobs", (await params).id, "invoices"]);
}
