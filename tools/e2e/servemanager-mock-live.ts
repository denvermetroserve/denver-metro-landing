const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3556";

const assert = (condition: unknown, message: string) => {
	if (!condition) throw new Error(message);
};

async function run() {
	const response = await fetch(`${baseUrl}/api/servemanager/intake`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Origin: baseUrl },
		body: JSON.stringify({
			requestId: "7db1309c-8591-4a42-a736-1f8ab29120d7",
			documents: [
				{ name: "summons.pdf", referenceNumber: "test-summons" },
				{ name: "complaint.pdf", referenceNumber: "test-complaint" },
			],
			servee: {
				serveeType: "individual",
				recipientName: "Jordan Example",
				businessName: "",
				registeredAgent: "",
				phoneNumbers: [{ value: "720-555-0100" }],
				emailAddresses: [{ value: "jordan@example.test" }],
				facebook: "jordan.example",
				instagram: "",
				linkedin: "jordan-example",
				documentIndexes: [0, 1],
			},
			additionalServees: [
				{
					serveeType: "business",
					recipientName: "",
					businessName: "Example LLC",
					registeredAgent: "Taylor Example",
					phoneNumbers: [],
					emailAddresses: [],
					facebook: "",
					instagram: "",
					linkedin: "",
					documentIndexes: [0],
				},
			],
			addresses: [
				{
					street: "100 Test Street",
					unit: "",
					city: "Denver",
					zip: "80202",
					locationType: "",
					serveeIndex: "0",
				},
				{
					street: "200 Business Road",
					unit: "Suite 2",
					city: "Denver",
					zip: "80203",
					locationType: "work",
					serveeIndex: "1",
				},
			],
			serviceInstructions: "Mock E2E service instructions.",
			caseName: "Example v. Example",
			court: "Denver County Court",
			courtState: "Colorado",
			courtDate: "2026-09-01",
			caseNumber: "2026CV000001",
			caseDetails: "Mock E2E case details.",
			caseType: "Debt & Collections",
			caseSubtype: "Civil",
			deadline: "2026-09-05",
			speed: "Expedited",
			difficultServeContext: "",
			addons: {
				witnessFee: false,
				skipTrace: true,
				eFiling: true,
				notarizedAffidavit: false,
				stakeout: false,
				mailingType: "certified",
				mailingTiming: "always",
				mailingOutcomes: [],
			},
			witnessFeeAmount: "",
			stakeoutHours: "",
		}),
	});
	const payload = (await response.json()) as {
		mode?: string;
		jobs?: Array<{ jobId: number; uploads: Array<{ putUrl: string }> }>;
	};

	assert(response.status === 200, `Expected 200, received ${response.status}.`);
	assert(payload.mode === "mock", "Expected mock mode response.");
	assert(payload.jobs?.length === 2, "Expected one mock job per servee.");
	assert(
		payload.jobs?.[0]?.uploads.length === 2,
		"Primary servee should receive two PDFs.",
	);
	assert(
		payload.jobs?.[1]?.uploads.length === 1,
		"Business servee should receive one PDF.",
	);

	for (const job of payload.jobs || []) {
		for (const upload of job.uploads) {
			const uploadResponse = await fetch(`${baseUrl}${upload.putUrl}`, {
				method: "PUT",
				body: new Uint8Array([37, 80, 68, 70]),
			});
			assert(
				uploadResponse.status === 204,
				"Expected mock document upload to succeed.",
			);
		}
	}

	console.log("ServeManager mock E2E PASSED");
	console.log(`created_mock_jobs=${payload.jobs?.length || 0}`);
}

run().catch((error) => {
	console.error("ServeManager mock E2E FAILED");
	console.error(error);
	process.exit(1);
});
