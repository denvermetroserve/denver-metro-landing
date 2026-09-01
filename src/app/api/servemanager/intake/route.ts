import { ServeManagerError, serveManager } from "@/lib/servemanager/client";
import {
	getServees,
	serveManagerIntakeSchema,
	toServeManagerJob,
} from "@/lib/servemanager/intake";
import {
	createMockIntakeResponse,
	isServeManagerMockMode,
} from "@/lib/servemanager/mock";
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
		const intake = parsed.data;
		if (isServeManagerMockMode()) {
			return NextResponse.json({
				mode: "mock",
				...createMockIntakeResponse(intake),
			});
		}
		const courtCase = await serveManager.createCourtCase({
			plaintiff: intake.caseName,
			number: intake.caseNumber || undefined,
			court_date: intake.courtDate || undefined,
		});
		const courtCaseId = courtCase.data.id;
		const jobs = [];
		for (const [serveeIndex] of getServees(intake).entries()) {
			const response = await serveManager.createJob(
				toServeManagerJob(intake, serveeIndex, courtCaseId),
			);
			const job = response.data;
			const uploads = (job.documents_to_be_served ?? []).map((document) => ({
				referenceNumber: document.reference_number,
				putUrl: document.upload?.links?.put_url,
			}));
			if (uploads.some((upload) => !upload.referenceNumber || !upload.putUrl)) {
				throw new Error("ServeManager did not return document upload URLs.");
			}
			jobs.push({
				jobId: job.id,
				jobNumber: String(job.servemanager_job_number),
				serveeIndex,
				uploads,
			});
		}
		return NextResponse.json({ courtCaseId, jobs });
	} catch (error) {
		console.error("ServeManager intake creation failed", error);
		const status = error instanceof ServeManagerError ? error.status : 500;
		return NextResponse.json(
			{ error: "Unable to create the service request with ServeManager." },
			{ status },
		);
	}
}
