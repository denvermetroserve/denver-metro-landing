import { proxyServeManager } from "@/app/api/servemanager/[...resource]/route";
import type { NextRequest } from "next/server";

export const GET = (request: NextRequest) =>
	proxyServeManager(request, ["court_cases"]);
export const POST = (request: NextRequest) =>
	proxyServeManager(request, ["court_cases"]);
