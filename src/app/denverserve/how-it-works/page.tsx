import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import HowItWorksCarousel from "@/components/services/HowItWorksCarousel";
import type { ServiceHowItWorks } from "@/types/service/services";
import { Clock3, FileCheck2, MapPinned, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "How It Works | Denver Metro Serve",
	description:
		"See the Denver Metro Serve service-of-process workflow from document upload to affidavit.",
};

const workflow: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Upload Documents",
		subtitle: "Build a complete service packet",
		description:
			"Upload PDFs, assign each document to the intended servee, and include any service instructions your team needs us to review.",
		label: "Documents",
		positionLabel: "Intake",
		payload: [{ name: "Documents", value: 100, fill: "#1f23ae" }],
		indicator: "line",
		icon: "UploadCloud",
	},
	{
		stepNumber: 2,
		title: "Add Recipient & Service Details",
		subtitle: "Give each assignment the right context",
		description:
			"Record the servee, possible service locations, court details, deadline, and any operational context for the assignment.",
		label: "Service details",
		positionLabel: "Preparation",
		payload: [{ name: "Details", value: 100, fill: "#3b41c5" }],
		indicator: "line",
		icon: "User",
	},
	{
		stepNumber: 3,
		title: "We Attempt Service",
		subtitle: "Route work by selected priority",
		description:
			"After acceptance and review, the assignment is routed according to the requested service speed and documented instructions.",
		label: "Service",
		positionLabel: "Field work",
		payload: [{ name: "Attempts", value: 100, fill: "#474dd0" }],
		indicator: "line",
		icon: "Network",
	},
	{
		stepNumber: 4,
		title: "Review Updates & Affidavit",
		subtitle: "Keep the record moving",
		description:
			"Review documented status updates and receive court-ready service documentation when the assignment is completed.",
		label: "Documentation",
		positionLabel: "Completion",
		payload: [{ name: "Affidavit", value: 100, fill: "#1f23ae" }],
		indicator: "dot",
		icon: "FileCheck",
	},
];

const workflowBenefits = [
	{
		title: "A complete intake record",
		copy: "Keep documents, servees, addresses, court details, and instructions together before an assignment is sent for review.",
		Icon: ShieldCheck,
	},
	{
		title: "Documented field updates",
		copy: "Review clear status information and attempt notes as they are recorded for your assignment.",
		Icon: MapPinned,
	},
	{
		title: "Priority that fits the matter",
		copy: "Select Standard, Expedited, Same Day, posting, or a difficult-serve review based on the matter's needs.",
		Icon: Clock3,
	},
	{
		title: "Court-ready documentation",
		copy: "Receive completed service documentation for counsel's review once the assignment is finished.",
		Icon: FileCheck2,
	},
] as const;
export default function HowItWorksPage() {
	return (
		<DenverMetroServePage>
			<section className="relative overflow-hidden border-[#c6c5d6] border-b bg-[radial-gradient(#e8eeff_1px,transparent_1px)] bg-[size:24px_24px] px-6 py-20 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-4xl text-center">
					<p className="font-bold text-[#1f23ae] text-sm uppercase tracking-[0.14em]">
						The workflow
					</p>
					<h1 className="mt-4 font-bold text-4xl tracking-tight sm:text-5xl">
						Service of Process, Engineered for Clarity.
					</h1>
					<p className="mx-auto mt-6 max-w-3xl text-[#454554] text-lg leading-8">
						Denver Metro Serve replaces the traditional black box with a
						structured workflow—from secure intake to documented updates and
						court-ready proof.
					</p>
					<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
						<Link
							className="rounded-full bg-[#1f23ae] px-7 py-3 font-semibold text-white hover:bg-[#3b41c5]"
							href="/start"
						>
							Start a Serve
						</Link>
						<Link
							className="rounded-full border border-[#767685] bg-white px-7 py-3 font-semibold hover:bg-[#f0f3ff]"
							href="/pricing"
						>
							View Pricing
						</Link>
					</div>
				</div>
			</section>
			<section className="bg-[#f0f3ff] px-6 py-20 lg:px-8">
				<div className="mx-auto max-w-6xl">
					<div className="mx-auto mb-10 max-w-2xl text-center">
						<h2 className="font-bold text-3xl">From Intake to Affidavit</h2>
						<p className="mt-3 text-[#454554] leading-7">
							Follow each stage of the assignment with the original interactive
							workflow experience.
						</p>
					</div>
					<HowItWorksCarousel howItWorks={workflow} />
				</div>
			</section>
			<section className="border-[#c6c5d6] border-y bg-white px-6 py-20 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-bold text-3xl">Built for Legal Operations</h2>
						<p className="mt-3 text-[#454554] leading-7">
							The workflow is designed to reduce administrative handoffs without
							replacing counsel's judgment about service requirements.
						</p>
					</div>
					<div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{workflowBenefits.map(({ title, copy, Icon }) => (
							<article
								className="group hover:-translate-y-1 rounded-xl border border-[#d9e3fb] bg-[#f9f9ff] p-6 shadow-sm transition hover:border-[#1f23ae]"
								key={title}
							>
								<Icon className="size-8 text-[#1f23ae] transition group-hover:scale-110" />
								<h3 className="mt-5 font-bold text-xl">{title}</h3>
								<p className="mt-3 text-[#454554] leading-6">{copy}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="px-6 py-20 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-xl border border-[#c6c5d6] bg-[#f0f3ff] p-8 md:flex-row md:p-12">
					<div className="max-w-2xl">
						<h2 className="font-bold text-3xl">
							Ready to start a service request?
						</h2>
						<p className="mt-3 text-[#454554] text-lg leading-7">
							Submit your documents and service details securely, then select
							the priority that fits your matter.
						</p>
					</div>
					<Link
						className="shrink-0 rounded-full bg-[#1f23ae] px-7 py-3 font-semibold text-white hover:bg-[#3b41c5]"
						href="/start"
					>
						Start a Serve
					</Link>
				</div>
			</section>
		</DenverMetroServePage>
	);
}
