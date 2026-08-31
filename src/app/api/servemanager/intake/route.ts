import { ServeManagerError, serveManager } from "@/lib/servemanager/client";
import {
	serveManagerIntakeSchema,
	toServeManagerJob,
} from "@/lib/servemanager/intake";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function requestOriginIsAllowed(request: Request) {
	const origin = request.headers.get("origin");
	const host = request.headers.get("host");
	if (!origin || !host) return false;
	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}

export async function POST(request: Request) {
	if (!requestOriginIsAllowed(request)) {
		return NextResponse.json(
			{ error: "Invalid request origin." },
			{ status: 403 },
		);
	}

	try {
		const parsed = serveManagerIntakeSchema.safeParse(await request.json());
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid service intake.", details: parsed.error.flatten() },
				{ status: 422 },
			);
		}
		const response = await serveManager.createJob(
			toServeManagerJob(parsed.data),
		);
		const job = response.data;
		const uploads = (job.documents_to_be_served ?? []).map((document) => ({
			referenceNumber: document.reference_number,
			putUrl: document.upload?.links?.put_url,
		}));
		if (uploads.some((upload) => !upload.referenceNumber || !upload.putUrl)) {
			throw new Error("ServeManager did not return document upload URLs.");
		}
		return NextResponse.json({
			jobId: job.id,
			jobNumber: String(job.servemanager_job_number),
			uploads,
		});
	} catch (error) {
		console.error("ServeManager intake creation failed", error);
		const status = error instanceof ServeManagerError ? error.status : 500;
		return NextResponse.json(
			{ error: "Unable to create the service request with ServeManager." },
			{ status },
		);
	}
}
