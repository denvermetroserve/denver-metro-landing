"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	FileText,
	GripVertical,
	LockKeyhole,
	Trash2,
	UploadCloud,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
	type FieldErrors,
	type FieldPath,
	FormProvider,
	useFieldArray,
	useForm,
	useFormContext,
	useWatch,
} from "react-hook-form";

import {
	DenverMetroServeFooter,
	DenverMetroServeHeader,
} from "@/components/denverserve/SiteShell";
import CheckoutDialog from "@/components/products/product/card/CheckoutDialog";
import {
	type IntakeFormValues,
	intakeSchema,
	intakeStepSchemas,
} from "./intakeSchema";

const steps = ["Documents", "Recipient", "Service", "Case", "Speed", "Review"];
const descriptions = [
	"Upload PDFs in the order they should be served.",
	"Tell us who needs to receive the documents.",
	"Provide the service address and instructions.",
	"Add case context and deadlines.",
	"Select the speed and any optional services.",
	"Review the intake before secure payment.",
];
const speeds = [
	{
		name: "Standard",
		price: 100,
		description:
			"3–5 day completion target. First attempt within 48 hours; up to 4 attempts included.",
	},
	{
		name: "Expedited",
		price: 145,
		description:
			"1–2 day completion target. First attempt within 24 hours; up to 4 attempts included.",
	},
	{
		name: "Same Day",
		price: 190,
		description:
			"Same-day completion target for urgent matters. First attempt immediately when available.",
	},
	{
		name: "2 Day Post",
		price: 55,
		description:
			"Documents posted on the door within 2 days of the server accepting the job.",
	},
	{
		name: "Difficult Serve",
		price: 295,
		description:
			"Safety-reviewed service for evasive or heightened-risk assignments. Acceptance is subject to operational review.",
	},
] as const;

const INCLUDED_DOCUMENT_PAGES = 10;
const ADDITIONAL_PAGE_PRICE = 0.25;

async function getPdfPageCount(file: File): Promise<number> {
	const source = new TextDecoder("latin1").decode(await file.arrayBuffer());
	const directPages = source.match(/\/Type\s*\/Page(?!s)\b/g)?.length ?? 0;
	if (directPages > 0) return directPages;

	const declaredCounts = Array.from(
		source.matchAll(/\/Count\s+(\d+)/g),
		(match) => Number(match[1]),
	).filter(Number.isFinite);
	const declaredPageCount = Math.max(0, ...declaredCounts);
	if (declaredPageCount > 0) return declaredPageCount;

	throw new Error("We could not determine the page count for this PDF.");
}

export default function StartServePage() {
	const [step, setStep] = useState(0);
	const [checkoutClientSecret, setCheckoutClientSecret] = useState<
		string | null
	>(null);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);
	const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
	const [showStepValidationHint, setShowStepValidationHint] = useState(false);
	const [serveManagerRequestId] = useState(() => crypto.randomUUID());
	const form = useForm<IntakeFormValues>({
		resolver: zodResolver(intakeSchema),
		mode: "onTouched",
		defaultValues: {
			documents: [],
			documentPageCounts: [],
			serveeType: "individual",
			recipientName: "",
			businessName: "",
			registeredAgent: "",
			recipientOrganization: "",
			phoneNumbers: [],
			emailAddresses: [],
			facebook: "",
			instagram: "",
			linkedin: "",
			documentIndexes: [],
			additionalServees: [],
			addresses: [
				{
					street: "",
					unit: "",
					city: "Denver",
					zip: "",
					locationType: "",
					serveeIndex: "0",
				},
			],
			serviceInstructions: "",
			caseName: "",
			court: "",
			courtState: "",
			courtDate: "",
			caseNumber: "",
			caseDetails: "",
			caseType: undefined,
			caseSubtype: undefined,
			deadline: "",
			speed: "Expedited",
			addons: {
				witnessFee: false,
				skipTrace: false,
				eFiling: false,
				notarizedAffidavit: false,
				stakeout: false,
				mailingType: "none",
				mailingTiming: "always",
				mailingOutcomes: [],
			},
			witnessFeeAmount: "",
			stakeoutHours: "",
			difficultServeContext: "",
			termsAccepted: false,
		},
	});
	const values = useWatch({ control: form.control });
	const selectedSpeed = values.speed ?? "Expedited";
	const additionalServees = Array.isArray(values.additionalServees)
		? values.additionalServees
		: [];
	const serveeCount = 1 + additionalServees.length;
	const documentAssignments = [
		Array.isArray(values.documentIndexes) ? values.documentIndexes : [],
		...additionalServees.map((servee) =>
			Array.isArray(servee.documentIndexes) ? servee.documentIndexes : [],
		),
	];
	const documentPageCounts = Array.isArray(values.documentPageCounts)
		? values.documentPageCounts
		: [];
	const documentPageCount = documentAssignments.reduce(
		(totalPages, selectedDocuments) =>
			totalPages +
			selectedDocuments.reduce(
				(sum, index) => sum + (documentPageCounts[index] ?? 0),
				0,
			),
		0,
	);
	const additionalPageCount = Math.max(
		0,
		documentPageCount - INCLUDED_DOCUMENT_PAGES,
	);
	const documentPrintFee = additionalPageCount * ADDITIONAL_PAGE_PRICE;
	const stakeoutFee = values.addons?.stakeout
		? Math.max(1, Number(values.stakeoutHours) || 0) * 100
		: 0;
	const total = useMemo(
		() =>
			(speeds.find((item) => item.name === selectedSpeed)?.price ?? 0) *
				serveeCount +
			(values.addons?.mailingType === "firstClass"
				? 5
				: values.addons?.mailingType === "certified"
					? 25
					: 0) +
			(values.addons?.eFiling ? 20 : 0) +
			(values.addons?.notarizedAffidavit ? 15 : 0) +
			stakeoutFee +
			documentPrintFee,
		[
			selectedSpeed,
			values.addons?.mailingType,
			values.addons?.eFiling,
			values.addons?.notarizedAffidavit,
			stakeoutFee,
			documentPrintFee,
			serveeCount,
		],
	);
	async function next() {
		const result = intakeStepSchemas[step].safeParse(form.getValues());
		if (result.success) {
			if (step === 2) {
				const currentValues = form.getValues();
				const currentAdditionalServees = Array.isArray(
					currentValues.additionalServees,
				)
					? currentValues.additionalServees
					: [];
				const currentAddresses = Array.isArray(currentValues.addresses)
					? currentValues.addresses
					: [];
				const missingServeeIndex = Array.from(
					{ length: currentAdditionalServees.length + 1 },
					(_, index) => index,
				).find(
					(index) =>
						!currentAddresses.some(
							(address) => address.serveeIndex === String(index),
						),
				);
				if (missingServeeIndex !== undefined) {
					form.setError("addresses", {
						message: `Add at least one service address for Servee ${missingServeeIndex + 1} before continuing.`,
					});
					setShowStepValidationHint(true);
					return;
				}
			}
			setShowStepValidationHint(false);
			setStep((current) => Math.min(current + 1, steps.length - 1));
			return;
		}

		const [firstIssue] = result.error.issues;
		for (const issue of result.error.issues) {
			const name = issue.path.join(".") as FieldPath<IntakeFormValues>;
			form.setError(name, { message: issue.message });
		}
		setShowStepValidationHint(true);
		if (firstIssue)
			form.setFocus(firstIssue.path.join(".") as FieldPath<IntakeFormValues>);
	}
	function back() {
		setShowStepValidationHint(false);
		setStep((current) => Math.max(current - 1, 0));
	}
	function handleInvalidSubmit(errors: FieldErrors<IntakeFormValues>) {
		const firstError = findFirstFormError(errors);
		setCheckoutError(
			firstError?.message
				? `Complete the required information before payment: ${firstError.message}`
				: "Complete the required information before continuing to secure payment.",
		);
		if (firstError?.path) form.setFocus(firstError.path);
	}
	async function submit(values: IntakeFormValues) {
		if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
			setCheckoutError(
				"Secure payment is not configured yet. Please contact support.",
			);
			return;
		}

		setCheckoutError(null);
		setIsCheckoutLoading(true);
		try {
			const documents = values.documents.map((document, index) => ({
				name: document.name,
				referenceNumber: `dms-${serveManagerRequestId}-${index + 1}`,
			}));
			const intakeResponse = await fetch("/api/servemanager/intake", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					requestId: serveManagerRequestId,
					documents,
					servee: {
						serveeType: values.serveeType,
						recipientName: values.recipientName,
						businessName: values.businessName,
						registeredAgent: values.registeredAgent,
						phoneNumbers: values.phoneNumbers,
						emailAddresses: values.emailAddresses,
						facebook: values.facebook,
						instagram: values.instagram,
						linkedin: values.linkedin,
						documentIndexes: values.documentIndexes,
					},
					additionalServees: values.additionalServees,
					addresses: values.addresses,
					serviceInstructions: values.serviceInstructions,
					caseName: values.caseName,
					court: values.court,
					courtState: values.courtState,
					courtDate: values.courtDate,
					caseNumber: values.caseNumber,
					caseDetails: values.caseDetails,
					caseType: values.caseType,
					caseSubtype: values.caseSubtype,
					deadline: values.deadline,
					speed: values.speed,
					difficultServeContext: values.difficultServeContext,
					addons: values.addons,
					witnessFeeAmount: values.witnessFeeAmount,
					stakeoutHours: values.stakeoutHours,
				}),
			});
			const intakePayload = await intakeResponse.json().catch(() => null);
			if (
				!intakeResponse.ok ||
				!Array.isArray(intakePayload?.jobs) ||
				intakePayload.jobs.length !== serveeCount
			) {
				throw new Error(
					intakePayload?.error || "Unable to prepare the service request.",
				);
			}

			await Promise.all(
				intakePayload.jobs.flatMap(
					(job: {
						serveeIndex: number;
						uploads: Array<{ referenceNumber?: string; putUrl?: string }>;
					}) => {
						const serveeDocumentIndexes =
							job.serveeIndex === 0
								? values.documentIndexes
								: values.additionalServees[job.serveeIndex - 1]
										?.documentIndexes || [];
						return serveeDocumentIndexes.map(async (index: number) => {
							const document = values.documents[index];
							const upload = job.uploads.find(
								(candidate) =>
									candidate.referenceNumber ===
									documents[index]?.referenceNumber,
							);
							if (!document || !upload?.putUrl) {
								throw new Error(
									`Upload URL missing for ${document?.name || "a document"}.`,
								);
							}
							const uploadResponse = await fetch(upload.putUrl, {
								method: "PUT",
								body: document,
							});
							if (!uploadResponse.ok)
								throw new Error(`Unable to upload ${document.name}.`);
						});
					},
				),
			);

			const serviceSpeed = values.speed || selectedSpeed || "Standard";
			const recipient =
				(values.serveeType === "business"
					? values.businessName
					: values.recipientName) ||
				values.businessName ||
				values.recipientName ||
				"service request";
			const checkoutDescription = `${serviceSpeed} Denver Metro Serve service for ${recipient}`;
			const response = await fetch("/api/stripe/intent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					price: Math.round(total * 100),
					description: checkoutDescription,
					metadata: {
						service_speed: serviceSpeed,
						servee_count: String(serveeCount),
						recipient,
						case_name: values.caseName || "Not provided",
						servemanager_job_ids: intakePayload.jobs
							.map((job: { jobId: number }) => job.jobId)
							.join(","),
						servemanager_job_numbers: intakePayload.jobs
							.map((job: { jobNumber: string }) => job.jobNumber)
							.join(","),
					},
				}),
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok || !payload?.clientSecret)
				throw new Error(
					payload?.details ||
						payload?.error ||
						"Unable to prepare secure payment.",
				);
			setCheckoutClientSecret(payload.clientSecret);
		} catch (error) {
			setCheckoutError(
				error instanceof Error
					? error.message
					: "Unable to prepare secure payment.",
			);
		} finally {
			setIsCheckoutLoading(false);
		}
	}
	return (
		<div className="min-h-screen bg-[#f9f9ff] text-[#111c2d]">
			<DenverMetroServeHeader intake />
			<main className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
				<p className="font-bold text-[#1f23ae] text-sm uppercase tracking-[0.14em]">
					Secure service intake
				</p>
				<h1 className="mt-3 font-bold text-4xl">Start a Serve</h1>
				<Progress current={step} />
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(submit, handleInvalidSubmit)}>
						<section className="mt-8 overflow-hidden rounded-xl border border-[#c6c5d6] bg-white shadow-sm">
							<div className="border-[#c6c5d6] border-b p-6">
								<h2 className="font-bold text-2xl">{steps[step]}</h2>
								<p className="mt-2 text-[#454554]">{descriptions[step]}</p>
								{showStepValidationHint && (
									<p
										aria-live="polite"
										className="mt-4 rounded-lg border border-[#ffdad6] bg-[#ffdad6] p-3 font-semibold text-[#93000a] text-sm"
									>
										We can’t continue yet. Complete the required fields
										highlighted below so we have the information needed to
										process this serve.
									</p>
								)}
							</div>
							<div className="p-6 sm:p-8">
								{step === 0 && <Documents />}
								{step === 1 && <Recipient />}
								{step === 2 && <Service />}
								{step === 3 && <CaseDetails />}
								{step === 4 && <Speed />}
								{step === 5 && (
									<Review
										additionalPageCount={additionalPageCount}
										documentPageCount={documentPageCount}
										documentPrintFee={documentPrintFee}
										serveeCount={serveeCount}
										total={total}
									/>
								)}
							</div>
							<div className="rounded-b-xl border-[#c6c5d6] border-t bg-[#f0f3ff] p-5">
								<div className="flex items-center justify-between">
									<button
										className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold disabled:opacity-40"
										disabled={step === 0}
										onClick={back}
										type="button"
									>
										<ArrowLeft className="size-4" /> Back
									</button>
									{step === 5 ? (
										<button
											className="inline-flex items-center gap-2 rounded-lg bg-[#1f23ae] px-5 py-3 font-semibold text-white hover:bg-[#3b41c5] disabled:cursor-wait disabled:opacity-60"
											disabled={isCheckoutLoading || !values.termsAccepted}
											type="submit"
										>
											<LockKeyhole className="size-4" />{" "}
											{isCheckoutLoading
												? "Preparing secure payment…"
												: "Continue to secure payment"}
										</button>
									) : (
										<button
											className="inline-flex items-center gap-2 rounded-lg bg-[#1f23ae] px-5 py-3 font-semibold text-white hover:bg-[#3b41c5]"
											onClick={next}
											type="button"
										>
											Next: {steps[step + 1]} <ArrowRight className="size-4" />
										</button>
									)}
								</div>
								{step === 5 && !values.termsAccepted && (
									<p className="mt-3 text-right font-semibold text-[#454554] text-sm">
										Confirm the request details above to enable secure payment.
									</p>
								)}
								{checkoutError && (
									<p
										aria-live="polite"
										className="mt-3 font-semibold text-[#ba1a1a] text-sm"
									>
										{checkoutError}
									</p>
								)}
							</div>
						</section>
					</form>
				</FormProvider>
				<CheckoutDialog
					clientSecret={checkoutClientSecret}
					isOpen={Boolean(checkoutClientSecret)}
					name="Denver Metro Serve process service"
					description={`${selectedSpeed} service request for ${serveeCount} ${serveeCount === 1 ? "servee" : "servees"}`}
					onClose={() => setCheckoutClientSecret(null)}
					price={total}
					sku="denver-metro-serve-process-service"
				/>
			</main>
			<DenverMetroServeFooter />
		</div>
	);
}

function Progress({ current }: { current: number }) {
	return (
		<ol className="mt-8 flex gap-2 overflow-x-auto pb-2">
			{steps.map((name, index) => (
				<li
					className={`flex shrink-0 items-center gap-2 font-semibold text-sm ${index <= current ? "text-[#1f23ae]" : "text-[#767685]"}`}
					key={name}
				>
					<span
						className={`flex size-7 items-center justify-center rounded-full ${index < current ? "bg-[#1f23ae] text-white" : index === current ? "border-2 border-[#1f23ae]" : "bg-[#e8eeff]"}`}
					>
						{index < current ? <Check className="size-4" /> : index + 1}
					</span>
					{name}
					{index < steps.length - 1 && (
						<span className="mx-1 text-[#c6c5d6]">—</span>
					)}
				</li>
			))}
		</ol>
	);
}
function Documents() {
	const {
		formState: { errors },
		clearErrors,
		setError,
		setValue,
		watch,
	} = useFormContext<IntakeFormValues>();
	const documents = watch("documents");
	const documentPageCounts = watch("documentPageCounts");
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	async function handleUpload(files: File[]) {
		if (files.length === 0) return;
		try {
			const pageCounts = await Promise.all(files.map(getPdfPageCount));
			setValue("documents", [...documents, ...files], {
				shouldTouch: true,
				shouldValidate: true,
			});
			setValue("documentPageCounts", [...documentPageCounts, ...pageCounts], {
				shouldTouch: true,
				shouldValidate: true,
			});
			clearErrors("documents");
		} catch (error) {
			setError("documents", {
				message:
					error instanceof Error
						? error.message
						: "Unable to determine the document page count.",
			});
		}
	}
	function removeDocument(index: number) {
		setValue(
			"documents",
			documents.filter((_, current) => current !== index),
			{
				shouldTouch: true,
				shouldValidate: true,
			},
		);
		setValue(
			"documentPageCounts",
			documentPageCounts.filter((_, current) => current !== index),
			{ shouldTouch: true, shouldValidate: true },
		);
	}
	function moveDocument(toIndex: number) {
		if (draggedIndex === null || draggedIndex === toIndex) return;
		const reorderedDocuments = [...documents];
		const reorderedPageCounts = [...documentPageCounts];
		const [file] = reorderedDocuments.splice(draggedIndex, 1);
		const [pageCount] = reorderedPageCounts.splice(draggedIndex, 1);
		if (!file || pageCount === undefined) return;
		reorderedDocuments.splice(toIndex, 0, file);
		reorderedPageCounts.splice(toIndex, 0, pageCount);
		setValue("documents", reorderedDocuments, {
			shouldTouch: true,
			shouldValidate: true,
		});
		setValue("documentPageCounts", reorderedPageCounts, {
			shouldTouch: true,
			shouldValidate: true,
		});
	}
	return (
		<>
			<label
				className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-[#bfc2ff] border-dashed bg-[#f0f3ff] p-8 text-center hover:bg-[#e8eeff]"
				onDragOver={(event) => event.preventDefault()}
				onDrop={(event) => {
					event.preventDefault();
					void handleUpload(Array.from(event.dataTransfer.files));
				}}
			>
				<UploadCloud className="size-10 text-[#1f23ae]" />
				<span className="mt-4 font-bold text-lg">
					Drop PDF files here or browse files
				</span>
				<span className="mt-2 text-[#454554] text-sm">
					PDF only · Maximum 25 MB per file · First 10 pages included
				</span>
				<input
					accept="application/pdf"
					className="sr-only"
					multiple
					onChange={(event) => {
						void handleUpload(Array.from(event.target.files ?? []));
						event.currentTarget.value = "";
					}}
					type="file"
				/>
			</label>
			<FieldError message={errors.documents?.message} />
			{documents.length > 0 && (
				<p className="mt-5 text-[#454554] text-sm">
					Drag files to set the order they should be served.
				</p>
			)}
			<ul>
				{documents.map((file, index) => (
					<li
						aria-label={`Drag to reorder ${file.name}`}
						className={`mt-4 flex items-center justify-between rounded-lg border border-[#c6c5d6] p-4 ${draggedIndex === index ? "opacity-50" : ""}`}
						draggable
						key={`${file.name}-${file.size}`}
						onDragEnd={() => setDraggedIndex(null)}
						onDragOver={(event) => event.preventDefault()}
						onDragStart={() => setDraggedIndex(index)}
						onDrop={(event) => {
							event.preventDefault();
							moveDocument(index);
							setDraggedIndex(null);
						}}
					>
						<span className="flex items-center gap-3">
							<GripVertical
								aria-hidden="true"
								className="size-5 cursor-grab text-[#767685]"
							/>
							<FileText className="size-6 text-[#1f23ae]" />
							{file.name}
						</span>
						<span className="text-[#454554] text-sm">
							{documentPageCounts[index]}{" "}
							{documentPageCounts[index] === 1 ? "page" : "pages"} ·{" "}
							{(file.size / 1024 / 1024).toFixed(1)} MB
						</span>
						<button
							aria-label={`Remove ${file.name}`}
							className="rounded p-2 text-[#ba1a1a] hover:bg-[#ffdad6]"
							onClick={() => removeDocument(index)}
							type="button"
						>
							<Trash2 className="size-4" />
						</button>
					</li>
				))}
			</ul>
		</>
	);
}
function Recipient() {
	const { control, setValue, watch } = useFormContext<IntakeFormValues>();
	const phones = useFieldArray({ control, name: "phoneNumbers" });
	const emails = useFieldArray({ control, name: "emailAddresses" });
	const additionalServees = useFieldArray({
		control,
		name: "additionalServees",
	});
	const serveeType = watch("serveeType");
	const documents = watch("documents");
	return (
		<div>
			<h3 className="font-bold text-xl">Servee Type</h3>
			<div className="mt-4 grid gap-4 sm:grid-cols-2">
				{(["individual", "business"] as const).map((type) => (
					<button
						className={`rounded-xl border p-5 text-left transition-colors ${serveeType === type ? "border-2 border-[#1f23ae] bg-[#f0f3ff]" : "border-[#c6c5d6] hover:bg-[#f0f3ff]"}`}
						key={type}
						onClick={() =>
							setValue("serveeType", type, {
								shouldTouch: true,
								shouldValidate: true,
							})
						}
						type="button"
					>
						<span className="block font-bold text-lg">
							{type === "individual" ? "Individual" : "Business"}
						</span>
						<span className="mt-1 block text-[#454554] text-sm">
							{type === "individual"
								? "Serve documents to a named person."
								: "Serve documents to a business or registered agent."}
						</span>
					</button>
				))}
			</div>
			<p className="mt-5 rounded-lg bg-[#f0f3ff] p-4 text-[#454554] text-sm">
				Note: The names listed below will appear in your affidavit.
			</p>
			<div className="mt-5 grid gap-5 md:grid-cols-2">
				{serveeType === "individual" ? (
					<Input label="Full name of servee" name="recipientName" required />
				) : (
					<>
						<Input label="Business legal name" name="businessName" required />
						<Input
							label="Registered agent full name"
							name="registeredAgent"
							required
						/>
					</>
				)}
				<Input label="Organization (optional)" name="recipientOrganization" />
			</div>
			<ContactList
				addLabel="Add phone number"
				fieldArray={phones}
				label="Phone numbers"
				name="phoneNumbers"
				placeholder="(720) 555-0198"
				type="tel"
			/>
			<ContactList
				addLabel="Add email address"
				fieldArray={emails}
				label="Email addresses"
				name="emailAddresses"
				placeholder="name@example.com"
				type="email"
			/>
			<div className="mt-6">
				<div className="flex items-center justify-between gap-4">
					<h3 className="font-bold text-lg">Social profiles</h3>
					<span className="text-[#454554] text-sm">Optional</span>
				</div>
				<div className="mt-3 grid gap-4 md:grid-cols-3">
					<Input
						label="Facebook"
						name="facebook"
						placeholder="Profile URL or handle"
					/>
					<Input
						label="Instagram"
						name="instagram"
						placeholder="Profile URL or handle"
					/>
					<Input
						label="LinkedIn"
						name="linkedin"
						placeholder="Profile URL or handle"
					/>
				</div>
			</div>
			<DocumentSelection
				documents={documents}
				label="Documents to be served to this servee"
				name="documentIndexes"
			/>
			<div className="mt-8 border-[#c6c5d6] border-t pt-6">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h3 className="font-bold text-xl">Additional servees</h3>
						<p className="mt-1 text-[#454554] text-sm">
							Each servee is priced at the selected service tier and needs their
							own document selection.
						</p>
					</div>
					<span className="text-[#454554] text-sm">
						{additionalServees.fields.length + 1} servee
						{additionalServees.fields.length === 0 ? "" : "s"}
					</span>
				</div>
				{additionalServees.fields.map((servee, index) => (
					<AdditionalServee
						documents={documents}
						index={index}
						key={servee.id}
						onRemove={() => additionalServees.remove(index)}
					/>
				))}
				{additionalServees.fields.length < 9 && (
					<button
						className="mt-5 font-semibold text-[#1f23ae] text-sm hover:underline"
						onClick={() =>
							additionalServees.append({
								serveeType: "individual",
								recipientName: "",
								businessName: "",
								registeredAgent: "",
								recipientOrganization: "",
								phoneNumbers: [],
								emailAddresses: [],
								facebook: "",
								instagram: "",
								linkedin: "",
								documentIndexes: [],
							})
						}
						type="button"
					>
						+ Add another servee
					</button>
				)}
			</div>
		</div>
	);
}
function DocumentSelection({
	documents,
	label,
	name,
}: {
	documents: File[];
	label: string;
	name: "documentIndexes" | `additionalServees.${number}.documentIndexes`;
}) {
	const {
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	const watchedSelected = watch(name);
	const selected = Array.isArray(watchedSelected) ? watchedSelected : [];
	const additionalServeeIndex = name.startsWith("additionalServees")
		? Number(name.split(".")[1])
		: null;
	const errorMessage =
		additionalServeeIndex === null
			? errors.documentIndexes?.message
			: errors.additionalServees?.[additionalServeeIndex]?.documentIndexes
					?.message;
	function toggleDocument(index: number, checked: boolean) {
		setValue(
			name as FieldPath<IntakeFormValues>,
			(checked
				? [...selected, index]
				: selected.filter((current) => current !== index)) as never,
			{ shouldTouch: true, shouldValidate: true },
		);
	}
	return (
		<fieldset className="mt-6 rounded-xl border border-[#c6c5d6] p-5">
			<legend className="px-1 font-bold text-lg">{label}</legend>
			{documents.length === 0 ? (
				<p className="text-[#ba1a1a] text-sm">
					Upload documents before assigning them to a servee.
				</p>
			) : (
				<div className="mt-3 space-y-2">
					{documents.map((document, index) => (
						<label
							className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#c6c5d6] p-3 hover:bg-[#f0f3ff]"
							key={`${document.name}-${document.size}-${document.lastModified}`}
						>
							<input
								checked={selected.includes(index)}
								onChange={(event) =>
									toggleDocument(index, event.target.checked)
								}
								type="checkbox"
							/>
							{document.name}
						</label>
					))}
				</div>
			)}
			<FieldError message={errorMessage} />
		</fieldset>
	);
}
function AdditionalServee({
	documents,
	index,
	onRemove,
}: {
	documents: File[];
	index: number;
	onRemove: () => void;
}) {
	const { control, register, watch } = useFormContext<IntakeFormValues>();
	const base = `additionalServees.${index}` as const;
	const serveeType = watch(`${base}.serveeType`);
	const phoneNumbers = useFieldArray({
		control,
		name: `${base}.phoneNumbers`,
	});
	const emailAddresses = useFieldArray({
		control,
		name: `${base}.emailAddresses`,
	});
	return (
		<div className="mt-5 rounded-xl border border-[#c6c5d6] p-5">
			<div className="flex items-center justify-between gap-4">
				<h4 className="font-bold text-lg">Servee {index + 2}</h4>
				<button
					className="font-semibold text-[#ba1a1a] text-sm"
					onClick={onRemove}
					type="button"
				>
					Remove
				</button>
			</div>
			<div className="mt-4 grid gap-5 md:grid-cols-2">
				<label className="font-semibold text-sm">
					Servee type
					<select
						className="mt-2 h-12 w-full rounded-lg border border-[#767685] bg-white px-3"
						{...register(`${base}.serveeType`)}
					>
						<option value="individual">Individual</option>
						<option value="business">Business</option>
					</select>
				</label>
				{serveeType === "business" ? (
					<>
						<label className="font-semibold text-sm">
							Business legal name<span className="ml-1 text-[#ba1a1a]">*</span>
							<input
								className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
								required
								{...register(`${base}.businessName`)}
							/>
						</label>
						<label className="font-semibold text-sm">
							Registered agent full name
							<span className="ml-1 text-[#ba1a1a]">*</span>
							<input
								className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
								required
								{...register(`${base}.registeredAgent`)}
							/>
						</label>
					</>
				) : (
					<label className="font-semibold text-sm">
						Full name of servee<span className="ml-1 text-[#ba1a1a]">*</span>
						<input
							className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
							required
							{...register(`${base}.recipientName`)}
						/>
					</label>
				)}
				<label className="font-semibold text-sm">
					Organization (optional)
					<input
						className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
						{...register(`${base}.recipientOrganization`)}
					/>
				</label>
			</div>
			<AdditionalContactFields
				addLabel="Add phone number"
				fieldArray={phoneNumbers}
				label="Phone numbers"
				name={`${base}.phoneNumbers`}
				placeholder="(720) 555-0198"
				type="tel"
			/>
			<AdditionalContactFields
				addLabel="Add email address"
				fieldArray={emailAddresses}
				label="Email addresses"
				name={`${base}.emailAddresses`}
				placeholder="name@example.com"
				type="email"
			/>
			<div className="mt-5 grid gap-4 md:grid-cols-3">
				<label className="font-semibold text-sm">
					Facebook (optional)
					<input
						className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
						placeholder="Profile URL or handle"
						{...register(`${base}.facebook`)}
					/>
				</label>
				<label className="font-semibold text-sm">
					Instagram (optional)
					<input
						className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
						placeholder="Profile URL or handle"
						{...register(`${base}.instagram`)}
					/>
				</label>
				<label className="font-semibold text-sm">
					LinkedIn (optional)
					<input
						className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
						placeholder="Profile URL or handle"
						{...register(`${base}.linkedin`)}
					/>
				</label>
			</div>
			<DocumentSelection
				documents={documents}
				label="Documents to be served to this servee"
				name={`${base}.documentIndexes`}
			/>
		</div>
	);
}
function AdditionalContactFields({
	addLabel,
	fieldArray,
	label,
	name,
	placeholder,
	type,
}: {
	addLabel: string;
	fieldArray:
		| ReturnType<
				typeof useFieldArray<
					IntakeFormValues,
					`additionalServees.${number}.phoneNumbers`
				>
		  >
		| ReturnType<
				typeof useFieldArray<
					IntakeFormValues,
					`additionalServees.${number}.emailAddresses`
				>
		  >;
	label: string;
	name:
		| `additionalServees.${number}.phoneNumbers`
		| `additionalServees.${number}.emailAddresses`;
	placeholder: string;
	type: "tel" | "email";
}) {
	const { register } = useFormContext<IntakeFormValues>();
	return (
		<div className="mt-5">
			<div className="flex items-center justify-between gap-4">
				<h5 className="font-bold">{label}</h5>
				<span className="text-[#454554] text-sm">Up to 3</span>
			</div>
			<div className="mt-3 space-y-3">
				{fieldArray.fields.map((field, fieldIndex) => (
					<div className="flex gap-3" key={field.id}>
						<input
							className="h-12 min-w-0 flex-1 rounded-lg border border-[#767685] px-3"
							placeholder={placeholder}
							type={type}
							{...register(`${name}.${fieldIndex}.value`)}
						/>
						<button
							className="rounded-lg border border-[#c6c5d6] px-3 font-semibold text-[#ba1a1a] text-sm"
							onClick={() => fieldArray.remove(fieldIndex)}
							type="button"
						>
							Remove
						</button>
					</div>
				))}
			</div>
			{fieldArray.fields.length < 3 && (
				<button
					className="mt-3 font-semibold text-[#1f23ae] text-sm hover:underline"
					onClick={() => fieldArray.append({ value: "" })}
					type="button"
				>
					+ {addLabel}
				</button>
			)}
		</div>
	);
}
function ContactList({
	addLabel,
	fieldArray,
	label,
	name,
	placeholder,
	type,
}: {
	addLabel: string;
	fieldArray:
		| ReturnType<typeof useFieldArray<IntakeFormValues, "phoneNumbers">>
		| ReturnType<typeof useFieldArray<IntakeFormValues, "emailAddresses">>;
	label: string;
	name: "phoneNumbers" | "emailAddresses";
	placeholder: string;
	type: "tel" | "email";
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	return (
		<div className="mt-6">
			<div className="flex items-center justify-between gap-4">
				<h3 className="font-bold text-lg">{label}</h3>
				<span className="text-[#454554] text-sm">Up to 3</span>
			</div>
			<div className="mt-3 space-y-3">
				{fieldArray.fields.map((field, index) => (
					<div className="flex gap-3" key={field.id}>
						<input
							className="h-12 min-w-0 flex-1 rounded-lg border border-[#767685] px-3"
							placeholder={placeholder}
							type={type}
							{...register(`${name}.${index}.value`)}
						/>
						<button
							className="rounded-lg border border-[#c6c5d6] px-3 font-semibold text-[#ba1a1a] text-sm"
							onClick={() => fieldArray.remove(index)}
							type="button"
						>
							Remove
						</button>
					</div>
				))}
			</div>
			{fieldArray.fields.length < 3 && (
				<button
					className="mt-3 font-semibold text-[#1f23ae] text-sm hover:underline"
					onClick={() => fieldArray.append({ value: "" })}
					type="button"
				>
					+ {addLabel}
				</button>
			)}
			<FieldError message={errors[name]?.message as string | undefined} />
		</div>
	);
}
function Service() {
	const {
		control,
		register,
		watch,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	const addresses = useFieldArray({ control, name: "addresses" });
	const serveeType = watch("serveeType");
	const primaryServee = watch("recipientName");
	const primaryBusiness = watch("businessName");
	const watchedAdditionalServees = watch("additionalServees");
	const additionalServees = Array.isArray(watchedAdditionalServees)
		? watchedAdditionalServees
		: [];
	const serveeOptions = [
		serveeType === "business"
			? primaryBusiness || "Primary business"
			: primaryServee || "Primary servee",
		...additionalServees.map((servee, index) =>
			servee.serveeType === "business"
				? servee.businessName || `Servee ${index + 2}`
				: servee.recipientName || `Servee ${index + 2}`,
		),
	];
	const [activeServeeIndex, setActiveServeeIndex] = useState(0);
	const watchedAddresses = watch("addresses");
	const addressValues = Array.isArray(watchedAddresses) ? watchedAddresses : [];
	const activeAddressIndexes = addressValues
		.map((address, index) => ({ address, index }))
		.filter(({ address }) => Number(address.serveeIndex) === activeServeeIndex)
		.map(({ index }) => index);
	function addAddressForActiveServee() {
		addresses.append({
			street: "",
			unit: "",
			city: "",
			zip: "",
			locationType: "",
			serveeIndex: String(activeServeeIndex),
		});
	}
	return (
		<div>
			<h3 className="font-bold text-xl">
				Location where documents will be served{" "}
				<span className="text-[#ba1a1a]">*</span>
			</h3>
			<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{serveeOptions.map((servee, serveeIndex) => {
					const count = addressValues.filter(
						(address) => Number(address.serveeIndex) === serveeIndex,
					).length;
					return (
						<button
							className={`rounded-xl border p-4 text-left ${activeServeeIndex === serveeIndex ? "border-2 border-[#1f23ae] bg-[#f0f3ff]" : "border-[#c6c5d6] hover:bg-[#f0f3ff]"}`}
							key={servee}
							onClick={() => setActiveServeeIndex(serveeIndex)}
							type="button"
						>
							<span className="block font-bold">Servee {serveeIndex + 1}</span>
							<span className="mt-1 block truncate text-[#454554] text-sm">
								{servee}
							</span>
							<span className="mt-2 block font-semibold text-[#1f23ae] text-xs">
								{count} of 3 possible addresses
							</span>
						</button>
					);
				})}
			</div>
			<div className="mt-5 space-y-5">
				{activeAddressIndexes.length === 0 && (
					<div className="rounded-xl border border-[#bfc2ff] border-dashed bg-[#f0f3ff] p-6">
						<h4 className="font-bold text-lg">Service address 1</h4>
						<p className="mt-2 text-[#454554] text-sm">
							Add the first possible service location for Servee{" "}
							{activeServeeIndex + 1}.
						</p>
						<button
							className="mt-4 rounded-lg bg-[#1f23ae] px-4 py-2 font-semibold text-sm text-white hover:bg-[#3b41c5]"
							onClick={addAddressForActiveServee}
							type="button"
						>
							Add service address 1
						</button>
					</div>
				)}
				{activeAddressIndexes.map((index, addressPosition) => {
					const address = addresses.fields[index];
					if (!address) return null;
					return (
						<div
							className="rounded-xl border border-[#c6c5d6] p-5"
							key={address.id}
						>
							<div className="flex items-center justify-between gap-4">
								<h4 className="font-bold">
									Service address {addressPosition + 1}
								</h4>
								{addresses.fields.length > 1 && (
									<button
										className="font-semibold text-[#ba1a1a] text-sm"
										onClick={() => addresses.remove(index)}
										type="button"
									>
										Remove
									</button>
								)}
							</div>
							<div className="mt-4 grid gap-5 md:grid-cols-2">
								<label className="font-semibold text-sm md:col-span-2">
									Servee for this address{" "}
									<span className="text-[#ba1a1a]">*</span>
									<select
										className="mt-2 h-12 w-full rounded-lg border border-[#767685] bg-white px-3"
										required
										{...register(`addresses.${index}.serveeIndex`)}
									>
										{serveeOptions.map((servee, serveeIndex) => (
											<option key={servee} value={String(serveeIndex)}>
												Servee {serveeIndex + 1}: {servee}
											</option>
										))}
									</select>
									<FieldError
										message={errors.addresses?.[index]?.serveeIndex?.message}
									/>
								</label>
								<Input
									label="Street address"
									name={`addresses.${index}.street`}
									placeholder="Street address"
									required
								/>
								<Input
									label="Unit/Suite #"
									name={`addresses.${index}.unit`}
									placeholder="Unit/Suite #"
								/>
								<Input
									label="City"
									name={`addresses.${index}.city`}
									placeholder="Select or type..."
									required
								/>
								<Input
									label="ZIP code"
									name={`addresses.${index}.zip`}
									required
								/>
								{addressPosition > 0 && (
									<label className="font-semibold text-sm md:col-span-2">
										Address type <span className="text-[#ba1a1a]">*</span>
										<select
											className="mt-2 h-12 w-full rounded-lg border border-[#767685] bg-white px-3"
											required
											{...register(`addresses.${index}.locationType`)}
										>
											<option value="">Select location type</option>
											<option value="work">Work</option>
											<option value="school">School</option>
											<option value="religious">Religious organization</option>
										</select>
										<FieldError
											message={errors.addresses?.[index]?.locationType?.message}
										/>
									</label>
								)}
							</div>
						</div>
					);
				})}
				{activeAddressIndexes.length > 0 && activeAddressIndexes.length < 3 && (
					<button
						className="font-semibold text-[#1f23ae] text-sm hover:underline"
						onClick={addAddressForActiveServee}
						type="button"
					>
						+ Add an address for Servee {activeServeeIndex + 1}
					</button>
				)}
				<FieldError message={errors.addresses?.message as string | undefined} />
				<div className="grid gap-5 md:grid-cols-2">
					<label className="font-semibold text-sm md:col-span-2">
						Service instructions
						<textarea
							className="mt-2 min-h-28 w-full rounded-lg border border-[#767685] p-3"
							{...register("serviceInstructions")}
							placeholder="Access notes, known availability, or other instructions."
						/>
					</label>
					<FieldError message={errors.serviceInstructions?.message} />
				</div>
			</div>
			<button
				className="mt-5 font-semibold text-[#1f23ae] text-sm hover:underline"
				type="button"
			>
				Need to edit? Enter address manually
			</button>
		</div>
	);
}
function CaseDetails() {
	const {
		register,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	return (
		<div>
			<h3 className="font-bold text-xl">Court Details</h3>
			<div className="mt-5 grid gap-5 md:grid-cols-2">
				<Select
					label="Court state"
					name="courtState"
					options={stateOptions}
					placeholder="Select state"
					required
				/>
				<Input label="Court date" name="courtDate" type="date" />
				<Input label="Case name" name="caseName" required />
				<Input label="Case number (optional)" name="caseNumber" />
				<Input label="Service deadline" name="deadline" required type="date" />
			</div>
			<div className="mt-10 border-[#c6c5d6] border-t pt-8">
				<h3 className="font-bold text-xl">Case Details</h3>
				<p className="mt-2 max-w-2xl text-[#454554] text-sm">
					Different case types follow different rules. Getting this right up
					front helps your serve hold up later.
				</p>
				<div className="mt-5 grid gap-5 md:grid-cols-2">
					<Select
						label="Case type"
						name="caseType"
						options={caseTypes}
						placeholder="Select case type"
						required
					/>
					<Select
						label="Select sub-type"
						name="caseSubtype"
						options={caseSubtypes}
						placeholder="Select sub-type"
						required
					/>
					<label className="font-semibold text-sm md:col-span-2">
						Additional case details
						<textarea
							className="mt-2 min-h-28 w-full rounded-lg border border-[#767685] p-3"
							{...register("caseDetails")}
							placeholder="Add instructions or details relevant to this case."
						/>
					</label>
					<FieldError message={errors.caseDetails?.message} />
				</div>
			</div>
		</div>
	);
}
function Speed() {
	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	const speed = watch("speed");
	const addons = watch("addons");
	return (
		<div>
			<div className="grid gap-4 md:grid-cols-2">
				{speeds.map((item) => {
					const isPopular = item.name === "Expedited";
					return (
						<button
							className={`relative rounded-xl border p-5 pt-8 text-left ${item.name === speed ? "border-2 border-[#1f23ae] bg-[#f0f3ff] shadow-sm" : "border-[#c6c5d6]"}`}
							key={item.name}
							onClick={() =>
								setValue("speed", item.name, {
									shouldTouch: true,
									shouldValidate: true,
								})
							}
							type="button"
						>
							{isPopular && (
								<span className="absolute top-0 right-0 rounded-tr-lg rounded-bl-xl bg-[#1f23ae] px-3 py-1 font-bold text-white text-xs uppercase tracking-wide">
									Most popular
								</span>
							)}
							<p className="font-bold text-xl">{item.name}</p>
							<p className="mt-2 min-h-12 text-[#454554] text-sm">
								{item.description}
							</p>
							<p className="mt-4 font-bold text-3xl">${item.price}</p>
						</button>
					);
				})}
			</div>
			{speed === "Difficult Serve" && (
				<div className="mt-6 rounded-xl border border-[#c6c5d6] bg-[#f0f3ff] p-5">
					<h3 className="font-bold text-lg">Difficult Serve review details</h3>
					<p className="mt-2 text-[#454554] text-sm">
						Tell us about known safety concerns, prior service attempts, access
						restrictions, schedule information, and whether law enforcement or a
						court order is involved. We review every request and may decline,
						pause, or refer an assignment for safety reasons.
					</p>
					<label className="mt-4 block font-semibold text-sm">
						Assignment context <span className="text-[#ba1a1a]">*</span>
						<textarea
							className="mt-2 min-h-32 w-full rounded-lg border border-[#767685] bg-white p-3"
							placeholder="Example: three documented attempts; gated building; recipient has threatened prior servers; best lawful service window is weekday mornings."
							required
							{...register("difficultServeContext")}
						/>
					</label>
					<FieldError message={errors.difficultServeContext?.message} />
				</div>
			)}
			<fieldset className="mt-8">
				<legend className="font-bold text-xl">Optional add-ons</legend>
				<Addon
					checked={addons.witnessFee}
					description="Include a witness fee check with your subpoena serve. Enter an amount, or have Denver Metro Serve calculate it for an additional charge."
					label="Witness Fee"
					priceLabel="Amount or calculated fee"
					onChange={(checked) => setValue("addons.witnessFee", checked)}
				/>
				{addons.witnessFee && (
					<label className="mt-3 block font-semibold text-sm">
						Witness fee amount (optional)
						<input
							className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
							inputMode="decimal"
							placeholder="Enter a specific amount"
							{...register("witnessFeeAmount")}
						/>
					</label>
				)}
				<Addon
					checked={addons.skipTrace}
					description="Authorizes an automatic $75 skiptrace only if a bad address makes it necessary."
					label="Skiptrace"
					priceLabel="$75 if used"
					onChange={(checked) => setValue("addons.skipTrace", checked)}
				/>
				<Addon
					checked={addons.eFiling}
					description="Direct submission of a return of service where available. Completed affidavits are automatically filed in the respective county."
					label="E-Filing Integration"
					priceLabel="+$20"
					onChange={(checked) => setValue("addons.eFiling", checked)}
				/>
				<Addon
					checked={addons.notarizedAffidavit}
					description="Receive a physical notarized copy via USPS."
					label="Mailed Affidavit"
					priceLabel="+$15"
					onChange={(checked) => setValue("addons.notarizedAffidavit", checked)}
				/>
				<Addon
					checked={addons.stakeout}
					description="Stationary observation at a lawful location to identify a service opportunity. No following or unsafe engagement; all assignments are subject to safety review."
					label="Stakeout service"
					priceLabel="$100 / hour"
					onChange={(checked) => setValue("addons.stakeout", checked)}
				/>
				{addons.stakeout && (
					<label className="mt-3 block font-semibold text-sm">
						Stakeout hours <span className="text-[#ba1a1a]">*</span>
						<input
							className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3"
							min="1"
							step="1"
							type="number"
							{...register("stakeoutHours")}
						/>
					</label>
				)}
				<MailingOptions />
			</fieldset>
		</div>
	);
}
function MailingOptions() {
	const { setValue, watch } = useFormContext<IntakeFormValues>();
	const addons = watch("addons");
	const outcomes = addons.mailingOutcomes;
	const mailingOptions = [
		{
			value: "firstClass",
			label: "First Class",
			price: "$5",
			copy: "First class mail to the service address after successful personal serve, posting, jail, or sub-service.",
		},
		{
			value: "certified",
			label: "Certified",
			price: "$25",
			copy: "Certified mail with tracking, regardless of outcome.",
		},
	] as const;
	return (
		<div className="mt-4 rounded-lg border border-[#c6c5d6] p-4">
			<h4 className="font-bold">Mailing</h4>
			<div className="mt-3 grid gap-3 md:grid-cols-2">
				{mailingOptions.map((option) => (
					<button
						className={`rounded-lg border p-4 text-left ${addons.mailingType === option.value ? "border-2 border-[#1f23ae] bg-[#f0f3ff]" : "border-[#c6c5d6]"}`}
						key={option.value}
						onClick={() => setValue("addons.mailingType", option.value)}
						type="button"
					>
						<span className="flex justify-between font-semibold">
							<span>{option.label}</span>
							<span>{option.price}</span>
						</span>
						<span className="mt-2 block text-[#454554] text-xs">
							{option.copy}
						</span>
					</button>
				))}
			</div>
			{addons.mailingType !== "none" && (
				<fieldset className="mt-5">
					<legend className="font-semibold text-sm">
						When to mail serve documents?
					</legend>
					<label className="mt-3 flex gap-2 text-sm">
						<input
							checked={addons.mailingTiming === "always"}
							name="mail-timing"
							onChange={() => setValue("addons.mailingTiming", "always")}
							type="radio"
						/>
						Always mail (default)
					</label>
					<label className="mt-3 flex gap-2 text-sm">
						<input
							checked={addons.mailingTiming === "outcome"}
							name="mail-timing"
							onChange={() => setValue("addons.mailingTiming", "outcome")}
							type="radio"
						/>
						Based on service outcome
					</label>
					{addons.mailingTiming === "outcome" && (
						<div className="mt-4 grid gap-2 sm:grid-cols-2">
							{mailingOutcomes.map((outcome) => (
								<OutcomeCheckbox
									checked={outcomes.includes(outcome)}
									key={outcome}
									label={outcome}
									onChange={(checked) =>
										setValue(
											"addons.mailingOutcomes",
											checked
												? [...outcomes, outcome]
												: outcomes.filter((item) => item !== outcome),
										)
									}
								/>
							))}
						</div>
					)}
				</fieldset>
			)}
		</div>
	);
}
const mailingOutcomes = [
	"Personal serve",
	"Entity",
	"Registered Agent",
	"Posting",
	"Jail",
	"Residential Substituted",
	"Work Substituted",
	"Refusal",
	"Mail if unsuccessful",
	"Other",
];
function OutcomeCheckbox({
	checked,
	label,
	onChange,
}: {
	checked: boolean;
	label: string;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label className="flex items-center gap-2 rounded border border-[#c6c5d6] p-3 text-sm">
			<input
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
				type="checkbox"
			/>
			{label}
		</label>
	);
}
function Addon({
	checked,
	label,
	priceLabel,
	description,
	onChange,
}: {
	checked: boolean;
	label: string;
	priceLabel: string;
	description: string;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label className="mt-4 flex cursor-pointer items-center justify-between rounded-lg border border-[#c6c5d6] p-4">
			<span className="flex items-center gap-3">
				<input
					checked={checked}
					onChange={(event) => onChange(event.target.checked)}
					type="checkbox"
				/>
				<span>
					<span className="block">{label}</span>
					<span className="mt-1 block font-normal text-[#454554] text-xs">
						{description}
					</span>
				</span>
			</span>
			<b className="max-w-36 text-right text-sm">{priceLabel}</b>
		</label>
	);
}
function Review({
	additionalPageCount,
	documentPageCount,
	documentPrintFee,
	serveeCount,
	total,
}: {
	additionalPageCount: number;
	documentPageCount: number;
	documentPrintFee: number;
	serveeCount: number;
	total: number;
}) {
	const {
		register,
		formState: { errors },
		watch,
	} = useFormContext<IntakeFormValues>();
	const values = watch();
	const price = speeds.find((item) => item.name === values.speed)?.price ?? 0;
	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 className="font-bold text-lg">Request Summary</h3>
				<dl className="mt-4 space-y-3 rounded-lg bg-[#f0f3ff] p-5">
					<div className="flex justify-between">
						<dt>Recipient</dt>
						<dd className="font-semibold">
							{values.recipientName || "Not provided"}
						</dd>
					</div>
					<div className="flex justify-between">
						<dt>Service speed</dt>
						<dd className="font-semibold">{values.speed}</dd>
					</div>
					<div className="flex justify-between">
						<dt>Servees</dt>
						<dd className="font-semibold">{serveeCount}</dd>
					</div>
					<div className="flex justify-between">
						<dt>Documents</dt>
						<dd className="font-semibold">
							{values.documents.length}{" "}
							{values.documents.length === 1 ? "file" : "files"}
						</dd>
					</div>
					<div className="flex justify-between">
						<dt>Total pages</dt>
						<dd className="font-semibold">{documentPageCount}</dd>
					</div>
				</dl>
			</div>
			<div className="rounded-lg border border-[#c6c5d6] p-5">
				<h3 className="font-bold text-lg">Order Summary</h3>
				<p className="mt-4 flex justify-between">
					<span>
						{values.speed} service × {serveeCount}
					</span>
					<b>${price * serveeCount}</b>
				</p>
				{additionalPageCount > 0 && (
					<p className="mt-2 flex justify-between">
						<span>Additional pages ({additionalPageCount} × $0.25)</span>
						<b>${documentPrintFee.toFixed(2)}</b>
					</p>
				)}
				{values.addons.witnessFee && (
					<p className="mt-2 flex justify-between">
						<span>Witness fee</span>
						<b>
							{values.witnessFeeAmount
								? `$${values.witnessFeeAmount}`
								: "Calculated at review"}
						</b>
					</p>
				)}
				{values.addons.skipTrace && (
					<p className="mt-2 flex justify-between">
						<span>Skiptrace</span>
						<b>$75 if used</b>
					</p>
				)}
				{values.addons.eFiling && (
					<p className="mt-2 flex justify-between gap-4">
						<span>E-Filing Integration</span>
						<b className="text-right">$20</b>
					</p>
				)}
				{values.addons.eFiling && (
					<p className="mt-1 text-[#454554] text-xs">
						Direct submission of a return of service where available. Completed
						affidavits are automatically filed in the respective county.
					</p>
				)}
				{values.addons.notarizedAffidavit && (
					<p className="mt-2 flex justify-between">
						<span>Mailed Affidavit</span>
						<b>$15</b>
					</p>
				)}
				{values.addons.stakeout && (
					<p className="mt-2 flex justify-between">
						<span>
							Stakeout service ({values.stakeoutHours} hour
							{values.stakeoutHours === "1" ? "" : "s"})
						</span>
						<b>${Math.max(1, Number(values.stakeoutHours) || 0) * 100}</b>
					</p>
				)}
				{values.addons.mailingType !== "none" && (
					<p className="mt-2 flex justify-between">
						<span>
							{values.addons.mailingType === "firstClass"
								? "First Class mailing"
								: "Certified mailing"}
						</span>
						<b>{values.addons.mailingType === "firstClass" ? "$5" : "$25"}</b>
					</p>
				)}
				<p className="mt-5 flex justify-between border-[#c6c5d6] border-t pt-4 font-bold text-xl">
					<span>Total</span>
					<span className="text-[#1f23ae]">${total}</span>
				</p>
				<label className="mt-6 flex gap-3 text-sm leading-5">
					<input {...register("termsAccepted")} type="checkbox" />I confirm that
					the information and service instructions are accurate.
				</label>
				<FieldError message={errors.termsAccepted?.message} />
			</div>
		</div>
	);
}
function Input({
	label,
	name,
	type = "text",
	required = false,
	placeholder,
}: {
	label: string;
	name: FieldPath<IntakeFormValues>;
	type?: string;
	required?: boolean;
	placeholder?: string;
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	const errorMessage = getFieldErrorMessage(errors, name);
	return (
		<>
			<label className="font-semibold text-sm">
				{label}
				{required && <span className="ml-1 text-[#ba1a1a]">*</span>}
				<input
					aria-invalid={Boolean(errorMessage)}
					className={`mt-2 h-12 w-full rounded-lg border px-3 ${errorMessage ? "border-[#ba1a1a] bg-[#fff8f7]" : "border-[#767685]"}`}
					placeholder={placeholder}
					required={required}
					type={type}
					{...register(name)}
				/>
			</label>
			<FieldError message={errorMessage} />
		</>
	);
}
function Select({
	label,
	name,
	options,
	placeholder,
	required = false,
}: {
	label: string;
	name: "courtState" | "caseType" | "caseSubtype";
	options: readonly string[];
	placeholder: string;
	required?: boolean;
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext<IntakeFormValues>();
	const errorMessage = getFieldErrorMessage(errors, name);
	return (
		<>
			<label className="font-semibold text-sm">
				{label}
				{required && <span className="ml-1 text-[#ba1a1a]">*</span>}
				<select
					aria-invalid={Boolean(errorMessage)}
					className={`mt-2 h-12 w-full rounded-lg border bg-white px-3 ${errorMessage ? "border-[#ba1a1a]" : "border-[#767685]"}`}
					{...register(name)}
				>
					<option value="">{placeholder}</option>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</label>
			<FieldError message={errorMessage} />
		</>
	);
}
const stateOptions = [
	"Colorado",
	"Alabama",
	"Alaska",
	"Arizona",
	"Arkansas",
	"California",
	"Connecticut",
	"Delaware",
	"Florida",
	"Georgia",
	"Illinois",
	"Kansas",
	"Maryland",
	"Massachusetts",
	"Michigan",
	"Minnesota",
	"Missouri",
	"Nevada",
	"New Jersey",
	"New Mexico",
	"New York",
	"North Carolina",
	"Ohio",
	"Oregon",
	"Pennsylvania",
	"Texas",
	"Utah",
	"Virginia",
	"Washington",
	"Wyoming",
] as const;
const caseTypes = [
	"Evictions & Housing",
	"Debt & Collections",
	"Subpoenas",
	"Family & Protective",
	"Other Case Types",
	"None of the above",
] as const;
const caseSubtypes = ["Civil", "Court Order", "Other"] as const;
function findFirstFormError(errors: FieldErrors<IntakeFormValues>): {
	message?: string;
	path?: FieldPath<IntakeFormValues>;
} {
	function visit(
		value: unknown,
		path: string[],
	): {
		message?: string;
		path?: FieldPath<IntakeFormValues>;
	} | null {
		if (!value || typeof value !== "object") return null;
		const record = value as Record<string, unknown>;
		if (typeof record.message === "string") {
			return {
				message: record.message,
				path: path.join(".") as FieldPath<IntakeFormValues>,
			};
		}
		for (const [key, child] of Object.entries(record)) {
			const result = visit(child, [...path, key]);
			if (result) return result;
		}
		return null;
	}

	return visit(errors, []) ?? {};
}

function getFieldErrorMessage(
	errors: unknown,
	path: string,
): string | undefined {
	let current: unknown = errors;
	for (const segment of path.split(".")) {
		if (typeof current !== "object" || current === null) return undefined;
		current = (current as Record<string, unknown>)[segment];
	}
	if (typeof current !== "object" || current === null) return undefined;
	const message = (current as { message?: unknown }).message;
	return typeof message === "string" ? message : undefined;
}
function FieldError({ message }: { message?: string }) {
	return message ? (
		<p aria-live="polite" className="mt-2 font-semibold text-[#ba1a1a] text-sm">
			{message}
		</p>
	) : null;
}
