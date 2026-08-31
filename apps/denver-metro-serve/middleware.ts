import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = new Set([
	"/",
	"/start",
	"/pricing",
	"/how-it-works",
	"/coverage",
	"/contact",
	"/privacy",
	"/tos",
	"/sla",
	"/success",
	"/failed",
]);

function notFound() {
	return new NextResponse("Not Found", { status: 404 });
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (
		pathname === "/api/stripe/intent" ||
		pathname.startsWith("/api/servemanager/")
	)
		return NextResponse.next();
	if (pathname.startsWith("/api/")) return notFound();
	if (
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/favicon") ||
		pathname.match(/\.(?:ico|png|jpg|jpeg|gif|svg|webp|xml|txt|webmanifest)$/i)
	)
		return NextResponse.next();
	if (publicPaths.has(pathname) || pathname.startsWith("/our-expertise"))
		return NextResponse.next();
	return notFound();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
