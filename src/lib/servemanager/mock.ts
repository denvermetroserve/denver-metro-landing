import type { ServeManagerIntake } from "./intake";

export function isServeManagerMockMode() {
	return process.env.SERVEMANAGER_MOCK_MODE === "true";
}

export function createMockIntakeResponse(intake: ServeManagerIntake) {
	const servees = [intake.servee, ...intake.additionalServees];
	return {
		courtCaseId: 900_000,
		jobs: servees.map((servee, serveeIndex) => {
			const jobId = 900_100 + serveeIndex;
			return {
				jobId,
				jobNumber: `MOCK-${String(jobId)}`,
				serveeIndex,
				uploads: intake.documents
					.filter((_, documentIndex) =>
						servee.documentIndexes.includes(documentIndex),
					)
					.map((document) => ({
						referenceNumber: document.referenceNumber,
						putUrl: `/api/servemanager/mock-uploads/${jobId}/${encodeURIComponent(document.referenceNumber)}`,
					})),
			};
		}),
	};
}
