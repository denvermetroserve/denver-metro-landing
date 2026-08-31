import { NextResponse } from "next/server";

const routes = [
	"GET /api/servemanager/account",
	"GET /api/servemanager/employees",
	"GET /api/servemanager/employees/:id",
	"GET|POST /api/servemanager/companies",
	"GET|PUT /api/servemanager/companies/:id",
	"GET|POST /api/servemanager/court_cases",
	"GET|PUT /api/servemanager/court_cases/:id",
	"GET|POST /api/servemanager/courts",
	"GET|PUT /api/servemanager/courts/:id",
	"GET|POST /api/servemanager/jobs",
	"GET|PUT|POST /api/servemanager/jobs/:id",
	"POST /api/servemanager/jobs/:id/uploads",
	"GET|POST /api/servemanager/jobs/:id/notes",
	"POST /api/servemanager/jobs/:id/attempts",
	"POST /api/servemanager/jobs/:id/invoices",
	"GET /api/servemanager/attempts",
	"GET|PUT|DELETE /api/servemanager/attempts/:id",
	"GET /api/servemanager/notes",
	"GET /api/servemanager/invoices",
	"GET|PUT /api/servemanager/invoices/:id",
	"GET|POST /api/servemanager/webhooks",
	"PUT|DELETE /api/servemanager/webhooks/:id",
];

export function GET() {
	return NextResponse.json({
		service: "Denver Metro Serve ServeManager gateway",
		authentication: "Bearer SERVEMANAGER_INTERNAL_API_TOKEN",
		routes,
	});
}
