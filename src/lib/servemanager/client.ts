import "server-only";

const SERVEMANAGER_BASE_URL = "https://www.servemanager.com";

export class ServeManagerError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = "ServeManagerError";
	}
}

export type ServeManagerDocumentUpload = {
	reference_number?: string;
	upload?: { links?: { put_url?: string } };
};

export type ServeManagerJob = {
	id: number;
	servemanager_job_number: string | number;
	documents_to_be_served?: ServeManagerDocumentUpload[];
	[key: string]: unknown;
};

export type ServeManagerResource = Record<string, unknown> & {
	id: number | string;
	type: string;
};

type ServeManagerResponse<T> = {
	data: T;
	links?: Record<string, string | null>;
};

function getApiKey() {
	const key = process.env.SERVEMANAGER_API_KEY?.trim();
	if (!key) throw new Error("SERVEMANAGER_API_KEY is not configured.");
	return key;
}

function basicAuthorization(apiKey: string) {
	return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

function endpoint(pathOrUrl: string) {
	if (pathOrUrl.startsWith(SERVEMANAGER_BASE_URL)) return pathOrUrl;
	return new URL(pathOrUrl, SERVEMANAGER_BASE_URL).toString();
}

async function request<T>(path: string, init: RequestInit = {}) {
	const response = await fetch(endpoint(path), {
		...init,
		headers: {
			Accept: "application/json",
			Authorization: basicAuthorization(getApiKey()),
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...init.headers,
		},
		cache: "no-store",
	});

	const text = await response.text();
	let payload: unknown = null;
	try {
		payload = text ? JSON.parse(text) : null;
	} catch {
		payload = text;
	}
	if (!response.ok) {
		throw new ServeManagerError(
			`ServeManager request failed (${response.status}).`,
			response.status,
			payload,
		);
	}
	return payload as T;
}

/** Makes a server-side request to an allowlisted ServeManager path. */
export function serveManagerRequest<T>(path: string, init: RequestInit = {}) {
	return request<T>(path, init);
}

type ResourceType =
	| "company"
	| "court_case"
	| "court"
	| "job"
	| "attempt"
	| "invoice"
	| "note"
	| "webhook";

function resourcePath(resource: string) {
	return `/api/${resource}`;
}

function withQuery(path: string, query = "") {
	if (!query) return path;
	return `${path}${query.startsWith("?") ? query : `?${query}`}`;
}

async function listResource<T extends ServeManagerResource>(
	resource: string,
	query = "",
) {
	return request<ServeManagerResponse<T[]>>(
		withQuery(resourcePath(resource), query),
	);
}

async function getResource<T extends ServeManagerResource>(
	resource: string,
	id: number | string,
) {
	return request<ServeManagerResponse<T>>(`${resourcePath(resource)}/${id}`);
}

async function createResource<T extends ServeManagerResource>(
	resource: string,
	type: ResourceType,
	data: Record<string, unknown>,
) {
	return request<ServeManagerResponse<T>>(resourcePath(resource), {
		method: "POST",
		body: JSON.stringify({ data: { type, ...data } }),
	});
}

async function updateResource<T extends ServeManagerResource>(
	resource: string,
	id: number | string,
	type: ResourceType,
	data: Record<string, unknown>,
) {
	return request<ServeManagerResponse<T>>(`${resourcePath(resource)}/${id}`, {
		method: "PUT",
		body: JSON.stringify({ data: { type, ...data } }),
	});
}

/** Server-only client for the ServeManager REST API. */
export const serveManager = {
	getAccount: () =>
		request<ServeManagerResponse<Record<string, unknown>>>("/api/account"),
	getJob: (jobId: number | string) =>
		request<ServeManagerResponse<ServeManagerJob>>(`/api/jobs/${jobId}`),
	listJobs: (query = "") =>
		request<ServeManagerResponse<ServeManagerJob[]>>(`/api/jobs${query}`),
	listEmployees: (query = "") =>
		listResource<ServeManagerResource>("employees", query),
	getEmployee: (employeeId: number | string) =>
		getResource<ServeManagerResource>("employees", employeeId),
	listCompanies: (query = "") =>
		listResource<ServeManagerResource>("companies", query),
	getCompany: (companyId: number | string) =>
		getResource<ServeManagerResource>("companies", companyId),
	createCompany: (data: Record<string, unknown>) =>
		createResource<ServeManagerResource>("companies", "company", data),
	updateCompany: (companyId: number | string, data: Record<string, unknown>) =>
		updateResource<ServeManagerResource>(
			"companies",
			companyId,
			"company",
			data,
		),
	listCourtCases: (query = "") =>
		listResource<ServeManagerResource>("court_cases", query),
	getCourtCase: (courtCaseId: number | string) =>
		getResource<ServeManagerResource>("court_cases", courtCaseId),
	createCourtCase: (data: Record<string, unknown>) =>
		createResource<ServeManagerResource>("court_cases", "court_case", data),
	updateCourtCase: (
		courtCaseId: number | string,
		data: Record<string, unknown>,
	) =>
		updateResource<ServeManagerResource>(
			"court_cases",
			courtCaseId,
			"court_case",
			data,
		),
	listCourts: (query = "") =>
		listResource<ServeManagerResource>("courts", query),
	getCourt: (courtId: number | string) =>
		getResource<ServeManagerResource>("courts", courtId),
	createCourt: (data: Record<string, unknown>) =>
		createResource<ServeManagerResource>("courts", "court", data),
	updateCourt: (courtId: number | string, data: Record<string, unknown>) =>
		updateResource<ServeManagerResource>("courts", courtId, "court", data),
	createJob: (data: Record<string, unknown>) =>
		request<ServeManagerResponse<ServeManagerJob>>("/api/jobs", {
			method: "POST",
			body: JSON.stringify({ data: { type: "job", ...data } }),
		}),
	updateJob: (jobId: number | string, data: Record<string, unknown>) =>
		request<ServeManagerResponse<ServeManagerJob>>(`/api/jobs/${jobId}`, {
			method: "PUT",
			body: JSON.stringify({ data: { type: "job", ...data } }),
		}),
	listAttempts: (query = "") =>
		listResource<ServeManagerResource>("attempts", query),
	getAttempt: (attemptId: number | string) =>
		getResource<ServeManagerResource>("attempts", attemptId),
	createAttempt: (jobId: number | string, data: Record<string, unknown>) =>
		request<ServeManagerResponse<ServeManagerResource>>(
			`/api/jobs/${jobId}/attempts`,
			{
				method: "POST",
				body: JSON.stringify({ data: { type: "attempt", ...data } }),
			},
		),
	updateAttempt: (attemptId: number | string, data: Record<string, unknown>) =>
		updateResource<ServeManagerResource>(
			"attempts",
			attemptId,
			"attempt",
			data,
		),
	deleteAttempt: (attemptId: number | string) =>
		request<void>(`/api/attempts/${attemptId}`, { method: "DELETE" }),
	createJobUploads: (jobId: number | string, data: Record<string, unknown>) =>
		request<ServeManagerResponse<ServeManagerResource[]>>(
			`/api/jobs/${jobId}/uploads`,
			{
				method: "POST",
				body: JSON.stringify({ data }),
			},
		),
	cancelJob: (jobId: number | string, label: string, body: string) =>
		request<ServeManagerResponse<ServeManagerJob>>(`/api/jobs/${jobId}`, {
			method: "POST",
			body: JSON.stringify({
				data: {
					type: "job",
					cancellation_note_label: label,
					cancellation_note_body: body,
				},
			}),
		}),
	createNote: (
		jobId: number | string,
		body: string,
		label = "Denver Metro Serve",
	) =>
		request<ServeManagerResponse<Record<string, unknown>>>(
			`/api/jobs/${jobId}/notes`,
			{
				method: "POST",
				body: JSON.stringify({
					data: { type: "note", label, body, visibility: ["server"] },
				}),
			},
		),
	listNotes: (query = "") => listResource<ServeManagerResource>("notes", query),
	listJobNotes: (jobId: number | string, query = "") =>
		request<ServeManagerResponse<ServeManagerResource[]>>(
			withQuery(`/api/jobs/${jobId}/notes`, query),
		),
	listInvoices: (query = "") =>
		listResource<ServeManagerResource>("invoices", query),
	getInvoice: (invoiceId: number | string) =>
		getResource<ServeManagerResource>("invoices", invoiceId),
	createJobInvoice: (jobId: number | string, data: Record<string, unknown>) =>
		request<ServeManagerResponse<ServeManagerResource>>(
			`/api/jobs/${jobId}/invoices`,
			{
				method: "POST",
				body: JSON.stringify({ data: { type: "invoice", ...data } }),
			},
		),
	updateInvoice: (invoiceId: number | string, data: Record<string, unknown>) =>
		updateResource<ServeManagerResource>(
			"invoices",
			invoiceId,
			"invoice",
			data,
		),
	listWebhooks: () => listResource<ServeManagerResource>("webhooks"),
	upsertWebhook: (data: Record<string, unknown>) =>
		createResource<ServeManagerResource>("webhooks", "webhook", {
			update_if_exists: true,
			...data,
		}),
	updateWebhook: (webhookId: number | string, data: Record<string, unknown>) =>
		updateResource<ServeManagerResource>(
			"webhooks",
			webhookId,
			"webhook",
			data,
		),
	deleteWebhook: (webhookId: number | string) =>
		request<void>(`/api/webhooks/${webhookId}`, { method: "DELETE" }),
};

/** Upload bytes to the short-lived, single-use URL returned by ServeManager. */
export async function uploadServeManagerDocument(putUrl: string, file: File) {
	const response = await fetch(putUrl, { method: "PUT", body: file });
	if (!response.ok) {
		throw new ServeManagerError(
			`Document upload failed (${response.status}).`,
			response.status,
		);
	}
}
