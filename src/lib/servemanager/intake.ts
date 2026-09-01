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
	facebook: z.string().trim().max(250).default(""),
	instagram: z.string().trim().max(250).default(""),
	linkedin: z.string().trim().max(250).default(""),
	documentIndexes: z.array(z.number().int().nonnegative()).min(1),
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
	addons: z.object({
		witnessFee: z.boolean(),
		skipTrace: z.boolean(),
		eFiling: z.boolean(),
		notarizedAffidavit: z.boolean(),
		stakeout: z.boolean(),
		mailingType: z.enum(["none", "firstClass", "certified"]),
		mailingTiming: z.enum(["always", "outcome"]),
		mailingOutcomes: z.array(z.string().max(100)).max(10),
	}),
	witnessFeeAmount: z.string().trim().max(32),
	stakeoutHours: z.string().trim().max(16),
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

export function getServees(intake: ServeManagerIntake) {
	return [intake.servee, ...intake.additionalServees];
}

function contactLines(servee: ServeManagerIntake["servee"]) {
	return [
		servee.phoneNumbers.length
			? `Phone(s): ${servee.phoneNumbers.map(({ value }) => value).join(", ")}`
			: "",
		servee.emailAddresses.length
			? `Email(s): ${servee.emailAddresses.map(({ value }) => value).join(", ")}`
			: "",
		servee.facebook ? `Facebook: ${servee.facebook}` : "",
		servee.instagram ? `Instagram: ${servee.instagram}` : "",
		servee.linkedin ? `LinkedIn: ${servee.linkedin}` : "",
	]
		.filter(Boolean)
		.join("\n");
}

function addonLines(intake: ServeManagerIntake) {
	const { addons } = intake;
	return [
		addons.witnessFee
			? `Witness fee: ${intake.witnessFeeAmount || "calculate at review"}`
			: "",
		addons.skipTrace ? "Skip trace authorized if bad address." : "",
		addons.eFiling ? "E-filing integration requested." : "",
		addons.notarizedAffidavit ? "Mailed notarized affidavit requested." : "",
		addons.stakeout
			? `Stakeout requested: ${intake.stakeoutHours || "hours to be confirmed"} hour(s).`
			: "",
		addons.mailingType !== "none"
			? `Mailing: ${addons.mailingType}; timing: ${addons.mailingTiming}; outcomes: ${addons.mailingOutcomes.join(", ") || "n/a"}.`
			: "",
	]
		.filter(Boolean)
		.join("\n");
}

type CustomFieldValues = Record<string, string>;

function configuredCustomFields(values: CustomFieldValues) {
	const rawMap = process.env.SERVEMANAGER_CUSTOM_FIELD_MAP?.trim();
	if (!rawMap) return {};
	try {
		const fieldMap = JSON.parse(rawMap) as Record<string, unknown>;
		return Object.fromEntries(
			Object.entries(fieldMap).flatMap(([sourceField, serveManagerField]) => {
				const value = values[sourceField];
				return typeof serveManagerField === "string" && value
					? [[serveManagerField, value]]
					: [];
			}),
		);
	} catch {
		throw new Error("SERVEMANAGER_CUSTOM_FIELD_MAP must be valid JSON.");
	}
}

export function toServeManagerJob(
	intake: ServeManagerIntake,
	serveeIndex: number,
	courtCaseId?: number | string,
) {
	const servee = getServees(intake)[serveeIndex];
	if (!servee) throw new Error(`Servee ${serveeIndex + 1} is missing.`);
	const recipientName = displayName(servee);
	const addresses = intake.addresses.filter(
		(address) => address.serveeIndex === String(serveeIndex),
	);
	const selectedDocuments = intake.documents.filter((_, index) =>
		servee.documentIndexes.includes(index),
	);
	if (!addresses.length || !selectedDocuments.length) {
		throw new Error(
			`Servee ${serveeIndex + 1} is missing an address or document.`,
		);
	}
	const custom = configuredCustomFields({
		servee_type: servee.serveeType,
		registered_agent: servee.registeredAgent,
		phone_numbers: servee.phoneNumbers.map(({ value }) => value).join(", "),
		email_addresses: servee.emailAddresses.map(({ value }) => value).join(", "),
		facebook: servee.facebook,
		instagram: servee.instagram,
		linkedin: servee.linkedin,
		case_name: intake.caseName,
		case_number: intake.caseNumber,
		court_name: intake.court,
		court_state: intake.courtState,
		case_type: intake.caseType,
		case_subtype: intake.caseSubtype,
		service_level: intake.speed,
		service_instructions: intake.serviceInstructions,
		difficult_serve_context: intake.difficultServeContext,
		witness_fee: intake.addons.witnessFee
			? intake.witnessFeeAmount || "Calculate at review"
			: "",
		skip_trace: intake.addons.skipTrace ? "Authorized" : "",
		e_filing: intake.addons.eFiling ? "Requested" : "",
		mailed_affidavit: intake.addons.notarizedAffidavit ? "Requested" : "",
		stakeout_hours: intake.addons.stakeout ? intake.stakeoutHours : "",
		mailing_type:
			intake.addons.mailingType === "none" ? "" : intake.addons.mailingType,
		mailing_timing:
			intake.addons.mailingType === "none" ? "" : intake.addons.mailingTiming,
		mailing_outcomes: intake.addons.mailingOutcomes.join(", "),
	});

	return {
		client_job_number: `DMS-${intake.requestId}-${serveeIndex + 1}`,
		job_status: process.env.SERVEMANAGER_INITIAL_JOB_STATUS || "On Hold",
		court_case_id: courtCaseId,
		rush: ["Expedited", "Same Day", "Difficult Serve"].includes(intake.speed),
		service_instructions: [
			`DENVER METRO SERVE REQUEST — Servee ${serveeIndex + 1}`,
			servee.serveeType === "business" && servee.registeredAgent
				? `Registered agent: ${servee.registeredAgent}`
				: "",
			contactLines(servee),
			`Service level: ${intake.speed}\n${intake.serviceInstructions}`,
			`Case: ${intake.caseName}\nCourt: ${intake.court || "Not provided"}\nCase number: ${intake.caseNumber || "Not provided"}\nType: ${intake.caseType} / ${intake.caseSubtype}\nDetails: ${intake.caseDetails || "Not provided"}`,
			addonLines(intake),
			intake.difficultServeContext
				? `Difficult serve context: ${intake.difficultServeContext}`
				: "",
		]
			.filter(Boolean)
			.join("\n\n"),
		due_date: intake.deadline || undefined,
		recipient_attributes: {
			name: recipientName,
			description:
				servee.serveeType === "business" && servee.registeredAgent
					? `Business recipient. Registered agent: ${servee.registeredAgent}`
					: "",
		},
		addresses_attributes: addresses.map((address, index) => ({
			label: index === 0 ? "Home" : address.locationType || "Other",
			address1: address.street,
			address2: address.unit || "",
			city: address.city,
			state: stateAbbreviation(intake.courtState),
			postal_code: address.zip,
			primary: address === primaryAddress,
		})),
		documents_to_be_served_attributes: selectedDocuments.map((document) => ({
			title: document.name,
			file_name: document.name,
			reference_number: document.referenceNumber,
			received_at: new Date().toISOString(),
		})),
		...(Object.keys(custom).length ? { custom } : {}),
	};
}
