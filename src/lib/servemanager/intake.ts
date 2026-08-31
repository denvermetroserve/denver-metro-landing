import { z } from "zod";

const documentSchema = z.object({
	name: z.string().trim().min(1).max(255),
	referenceNumber: z.string().trim().min(1).max(100),
});

const addressSchema = z.object({
	street: z.string().trim().min(1).max(255),
	unit: z.string().trim().max(255).optional(),
	city: z.string().trim().min(1).max(100),
	zip: z.string().trim().min(1).max(16),
	locationType: z.enum(["", "work", "school", "religious"]),
	serveeIndex: z.string().regex(/^\d+$/),
});

const serveeSchema = z.object({
	serveeType: z.enum(["individual", "business"]),
	recipientName: z.string().trim().max(255),
	businessName: z.string().trim().max(255),
	registeredAgent: z.string().trim().max(255),
	phoneNumbers: z.array(z.object({ value: z.string().trim().max(30) })).max(3),
	emailAddresses: z
		.array(z.object({ value: z.string().trim().email() }))
		.max(3),
});

export const serveManagerIntakeSchema = z.object({
	requestId: z.string().uuid(),
	documents: z.array(documentSchema).min(1).max(20),
	servee: serveeSchema,
	additionalServees: z.array(serveeSchema).max(9).default([]),
	addresses: z.array(addressSchema).min(1).max(30),
	serviceInstructions: z.string().trim().max(2_000),
	caseName: z.string().trim().min(1).max(255),
	court: z.string().trim().max(255),
	courtState: z.string().trim().min(2).max(100),
	courtDate: z.string().trim().max(50),
	caseNumber: z.string().trim().max(255),
	caseDetails: z.string().trim().max(2_000),
	caseType: z.string().trim().max(100),
	caseSubtype: z.string().trim().max(100),
	deadline: z.string().trim().max(50),
	speed: z.string().trim().max(100),
	difficultServeContext: z.string().trim().max(2_000),
});

export type ServeManagerIntake = z.infer<typeof serveManagerIntakeSchema>;

function displayName(servee: ServeManagerIntake["servee"]) {
	return servee.serveeType === "business"
		? servee.businessName
		: servee.recipientName;
}

function stateAbbreviation(state: string) {
	const states: Record<string, string> = {
		Colorado: "CO",
		Wyoming: "WY",
		Nebraska: "NE",
		Kansas: "KS",
		New_Mexico: "NM",
		Utah: "UT",
	};
	return states[state] || state;
}

export function toServeManagerJob(intake: ServeManagerIntake) {
	const primary = intake.servee;
	const recipientName = displayName(primary);
	const primaryAddress = intake.addresses.find(
		(address) => address.serveeIndex === "0",
	);

	return {
		client_job_number: `DMS-${intake.requestId}`,
		job_status: process.env.SERVEMANAGER_INITIAL_JOB_STATUS || "On Hold",
		service_instructions: [
			intake.serviceInstructions,
			`Denver Metro Serve intake: ${intake.speed}.`,
			intake.difficultServeContext
				? `Difficult serve context: ${intake.difficultServeContext}`
				: "",
		]
			.filter(Boolean)
			.join("\n\n"),
		due_date: intake.deadline || undefined,
		recipient_attributes: {
			name: recipientName,
			email: primary.emailAddresses[0]?.value || "",
			phone: primary.phoneNumbers[0]?.value || "",
			description:
				primary.serveeType === "business" && primary.registeredAgent
					? `Registered agent: ${primary.registeredAgent}`
					: "",
		},
		addresses_attributes: intake.addresses.map((address, index) => ({
			label: index === 0 ? "Home" : address.locationType || "Other",
			address1: address.street,
			address2: address.unit || "",
			city: address.city,
			state: stateAbbreviation(intake.courtState),
			postal_code: address.zip,
			primary: address === primaryAddress,
		})),
		documents_to_be_served_attributes: intake.documents.map((document) => ({
			title: document.name,
			file_name: document.name,
			reference_number: document.referenceNumber,
			received_at: new Date().toISOString(),
		})),
		custom: {
			denver_metro_serve_case_name: intake.caseName,
			denver_metro_serve_case_number: intake.caseNumber,
			denver_metro_serve_case_type: `${intake.caseType} / ${intake.caseSubtype}`,
			denver_metro_serve_court: intake.court,
			denver_metro_serve_additional_servees: intake.additionalServees
				.map(displayName)
				.filter(Boolean)
				.join(", "),
		},
	};
}
