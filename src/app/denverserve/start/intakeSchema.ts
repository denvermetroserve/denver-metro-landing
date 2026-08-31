import { z } from "zod";

const documentSchema = z
	.custom<File>(
		(value) => typeof File !== "undefined" && value instanceof File,
		{ message: "Each upload must be a valid file." },
	)
	.refine(
		(file) =>
			file.type === "application/pdf" ||
			file.name.toLowerCase().endsWith(".pdf"),
		"Upload PDF documents only.",
	)
	.refine(
		(file) => file.size <= 25 * 1024 * 1024,
		"Each document must be 25 MB or smaller.",
	);

const contactValue = z.object({
	value: z.string().trim().min(1, "Enter a value or remove this field."),
});

const phoneValue = contactValue.extend({
	value: z.string().trim().min(7, "Enter a valid phone number.").max(30),
});

const emailValue = contactValue.extend({
	value: z.string().trim().email("Enter a valid email address."),
});

const addressSchema = z.object({
	street: z
		.string()
		.trim()
		.min(5, "Street address is required to locate the servee."),
	unit: z.string().trim(),
	city: z
		.string()
		.trim()
		.min(2, "City is required to identify the service location."),
	zip: z
		.string()
		.trim()
		.min(1, "ZIP code is required to identify the service location.")
		.regex(/^\d{5}(?:-\d{4})?$/, "Enter a valid ZIP code."),
	locationType: z.enum(["", "work", "school", "religious"]),
	serveeIndex: z.string().min(1, "Select the servee for this address."),
});

const recipientFields = z
	.object({
		serveeType: z.enum(["individual", "business"]),
		recipientName: z.string().trim(),
		businessName: z.string().trim(),
		registeredAgent: z.string().trim(),
		recipientOrganization: z.string().trim(),
		phoneNumbers: z.array(phoneValue).max(3, "Add up to three phone numbers."),
		emailAddresses: z
			.array(emailValue)
			.max(3, "Add up to three email addresses."),
		facebook: z.string().trim().max(250, "Keep this under 250 characters."),
		instagram: z.string().trim().max(250, "Keep this under 250 characters."),
		linkedin: z.string().trim().max(250, "Keep this under 250 characters."),
		documentIndexes: z
			.array(z.number().int().nonnegative())
			.min(1, "Select at least one document for this servee."),
		additionalServees: z
			.array(
				z.object({
					serveeType: z.enum(["individual", "business"]),
					recipientName: z.string().trim(),
					businessName: z.string().trim(),
					registeredAgent: z.string().trim(),
					recipientOrganization: z.string().trim(),
					phoneNumbers: z.array(phoneValue).max(3),
					emailAddresses: z.array(emailValue).max(3),
					facebook: z.string().trim().max(250),
					instagram: z.string().trim().max(250),
					linkedin: z.string().trim().max(250),
					documentIndexes: z
						.array(z.number().int().nonnegative())
						.min(1, "Select at least one document for this servee."),
				}),
			)
			.max(9, "Add up to ten servees per request."),
	})
	.superRefine((values, context) => {
		if (values.serveeType === "individual" && values.recipientName.length < 2) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Enter the servee's full name.",
				path: ["recipientName"],
			});
		}
		if (values.serveeType === "business" && values.businessName.length < 2) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Enter the business's legal name.",
				path: ["businessName"],
			});
		}
		if (values.serveeType === "business" && values.registeredAgent.length < 2) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Enter the registered agent's full name.",
				path: ["registeredAgent"],
			});
		}
		const additionalServees = Array.isArray(values.additionalServees)
			? values.additionalServees
			: [];
		for (const [index, servee] of additionalServees.entries()) {
			if (
				servee.serveeType === "individual" &&
				servee.recipientName.length < 2
			) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Enter the servee's full name.",
					path: ["additionalServees", index, "recipientName"],
				});
			}
			if (servee.serveeType === "business" && servee.businessName.length < 2) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Enter the business's legal name.",
					path: ["additionalServees", index, "businessName"],
				});
			}
			if (
				servee.serveeType === "business" &&
				servee.registeredAgent.length < 2
			) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Enter the registered agent's full name.",
					path: ["additionalServees", index, "registeredAgent"],
				});
			}
		}
	});

const serviceFields = z
	.object({
		addresses: z
			.array(addressSchema)
			.min(1, "Add at least one service address.")
			.max(30, "Add up to three service addresses per servee."),
		serviceInstructions: z
			.string()
			.trim()
			.max(2_000, "Instructions must be 2,000 characters or fewer."),
	})
	.superRefine((values, context) => {
		// Zod may run refinements with a partial value while another field is
		// invalid. Treat absent arrays as empty so validation can report the
		// field error instead of throwing during checkout.
		const addresses = Array.isArray(values.addresses) ? values.addresses : [];
		const addressesSeenByServee = new Map<string, number>();
		for (const [index, address] of addresses.entries()) {
			const addressNumber = addressesSeenByServee.get(address.serveeIndex) ?? 0;
			addressesSeenByServee.set(address.serveeIndex, addressNumber + 1);
			if (addressNumber > 0 && !address.locationType) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Select whether this address is work, school, or religious.",
					path: ["addresses", index, "locationType"],
				});
			}
		}
		const addressCounts = new Map<string, number>();
		for (const address of addresses) {
			addressCounts.set(
				address.serveeIndex,
				(addressCounts.get(address.serveeIndex) ?? 0) + 1,
			);
		}
		for (const [serveeIndex, count] of addressCounts) {
			if (count > 3) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Add up to three service addresses per servee.",
					path: ["addresses"],
				});
			}
		}
	});

const caseFields = z.object({
	caseName: z.string().trim().min(2, "Enter the case name."),
	court: z.string().trim(),
	courtState: z.string().trim().min(2, "Select the court state."),
	courtDate: z.string(),
	caseNumber: z.string().trim(),
	caseDetails: z
		.string()
		.trim()
		.max(2_000, "Case details must be 2,000 characters or fewer."),
	caseType: z.enum(
		[
			"Evictions & Housing",
			"Debt & Collections",
			"Subpoenas",
			"Family & Protective",
			"Other Case Types",
			"None of the above",
		],
		{ errorMap: () => ({ message: "Select a case type." }) },
	),
	caseSubtype: z.enum(["Civil", "Court Order", "Other"], {
		errorMap: () => ({ message: "Select a sub-type." }),
	}),
	deadline: z.string().min(1, "Select a service deadline."),
});

const speedFields = z
	.object({
		speed: z.enum(
			["Standard", "Expedited", "Same Day", "2 Day Post", "Difficult Serve"],
			{
				errorMap: () => ({ message: "Select a service speed." }),
			},
		),
		addons: z.object({
			witnessFee: z.boolean(),
			skipTrace: z.boolean(),
			eFiling: z.boolean(),
			notarizedAffidavit: z.boolean(),
			stakeout: z.boolean(),
			mailingType: z.enum(["none", "firstClass", "certified"]),
			mailingTiming: z.enum(["always", "outcome"]),
			mailingOutcomes: z.array(z.string()),
		}),
		witnessFeeAmount: z
			.string()
			.trim()
			.regex(/^\d+(?:\.\d{1,2})?$/, "Enter a valid dollar amount.")
			.or(z.literal("")),
		stakeoutHours: z
			.string()
			.regex(/^\d+$/, "Enter whole stakeout hours.")
			.or(z.literal("")),
		difficultServeContext: z
			.string()
			.trim()
			.max(2_000, "Keep difficult-serve context under 2,000 characters."),
	})
	.superRefine((values, context) => {
		if (
			values.addons.stakeout &&
			(!values.stakeoutHours || Number(values.stakeoutHours) < 1)
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Enter at least one stakeout hour.",
				path: ["stakeoutHours"],
			});
		}
		if (
			values.speed === "Difficult Serve" &&
			values.difficultServeContext.length < 20
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Provide safety concerns, prior attempts, and known access details for review.",
				path: ["difficultServeContext"],
			});
		}
	});

const reviewFields = z.object({
	termsAccepted: z.literal(true, {
		errorMap: () => ({
			message: "You must confirm the request details before continuing.",
		}),
	}),
});

// Conditional checks happen when their matching intake step advances. This
// final resolver remains declarative so a partial form value cannot crash the
// payment submit path.
export const intakeSchema = z.object({
	documents: z
		.array(documentSchema)
		.min(1, "Upload at least one PDF document."),
	documentPageCounts: z
		.array(z.number().int().min(1))
		.min(1, "Unable to determine the document page count."),
	...recipientFields.shape,
	...serviceFields.shape,
	...caseFields.shape,
	...speedFields.shape,
	...reviewFields.shape,
});

export const intakeStepSchemas = [
	z.object({
		documents: z
			.array(documentSchema)
			.min(1, "Upload at least one PDF document."),
		documentPageCounts: z
			.array(z.number().int().min(1))
			.min(1, "Unable to determine the document page count."),
	}),
	recipientFields,
	serviceFields,
	caseFields,
	speedFields,
	reviewFields,
] as const;

export type IntakeFormValues = z.infer<typeof intakeSchema>;
