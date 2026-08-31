import { proxyServeManager } from "@/app/api/servemanager/[...resource]/route";
import type { NextRequest } from "next/server";

export const GET = (request: NextRequest) =>
	proxyServeManager(request, ["account"]);
