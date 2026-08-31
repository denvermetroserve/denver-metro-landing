import type { CaseStudy } from "@/types/case-study";
import type { ServiceHowItWorks } from "@/types/service/services";

// These are illustrative operational scenarios, not client endorsements or
// promises of a particular legal or service outcome.
const processServingWorkflow: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Complete the intake",
		subtitle: "Documents, servees, and instructions",
		description:
			"Counsel provides the service packet, recipient information, possible locations, and relevant court context.",
		label: "Intake",
		positionLabel: "Preparation",
		payload: [{ name: "Intake", value: 100, fill: "#1f23ae" }],
		indicator: "line",
		icon: "UploadCloud",
	},
	{
		stepNumber: 2,
		title: "Operational review",
		subtitle: "Confirm service context",
		description:
			"The assignment is reviewed for practical details, selected priority, and any requested add-ons before field work begins.",
		label: "Review",
		positionLabel: "Assignment",
		payload: [{ name: "Review", value: 100, fill: "#3b41c5" }],
		indicator: "line",
		icon: "ShieldCheck",
	},
	{
		stepNumber: 3,
		title: "Documented service attempts",
		subtitle: "Status stays visible",
		description:
			"Assignment status and attempt information are documented for counsel's review as the service work progresses.",
		label: "Service",
		positionLabel: "Field work",
		payload: [{ name: "Service", value: 100, fill: "#474dd0" }],
		indicator: "line",
		icon: "Network",
	},
	{
		stepNumber: 4,
		title: "Affidavit workflow",
		subtitle: "Complete the documentation record",
		description:
			"After completion, court-ready documentation is provided for counsel's review and optional filing support where available.",
		label: "Affidavit",
		positionLabel: "Completion",
		payload: [{ name: "Affidavit", value: 100, fill: "#1f23ae" }],
		indicator: "dot",
		icon: "FileCheck",
	},
];

export const denverMetroServeCaseStudies: CaseStudy[] = [
	{
		id: "law-firm-process-service",
		title: "Law Firm Process Service Intake",
		subtitle:
			"Organizing separate document packets, contacts, and possible locations for a commercial dispute.",
		slug: "law-firm-process-service",
		categories: ["Process service", "Law firms"],
		industries: ["Legal operations"],
		copyright: {
			title: "Need help organizing a multi-recipient assignment?",
			subtitle:
				"Start a secure intake and provide the packet and address details for each servee.",
			ctaText: "Start a Serve",
			ctaLink: "/start",
		},
		tags: ["Document packets", "Service addresses", "Commercial"],
		clientName: "Illustrative law-firm workflow",
		clientDescription:
			"A representative workflow for a matter requiring coordinated service to multiple individuals and business contacts.",
		featuredImage:
			"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
		thumbnailImage:
			"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
		businessChallenges: [
			"Keep each servee's documents and possible locations distinct.",
			"Give the operations team enough context to route the assignment accurately.",
			"Maintain a clear record of the service information submitted for each recipient.",
		],
		lastModified: new Date("2026-08-31T00:00:00.000Z"),
		howItWorks: processServingWorkflow,
		businessOutcomes: [
			{
				title: "Workflow focus",
				subtitle: "Recipient-by-recipient organization",
			},
			{
				title: "Documentation focus",
				subtitle: "Clear intake and status history",
			},
		],
		solutions: [
			"Assign documents to the intended servee during intake.",
			"Record up to three possible service addresses for each servee.",
			"Select a service speed that matches counsel's deadline and instructions.",
		],
		description:
			"This illustrative scenario shows how a legal team can prepare a coordinated request when a matter involves more than one servee. Counsel remains responsible for selecting a lawful method of service and managing all case deadlines.",
		results: [
			{ title: "Recipients", value: "Multiple" },
			{ title: "Packet handling", value: "Per-servee" },
			{ title: "Location record", value: "Per-servee" },
		],
		featured: true,
	},
	{
		id: "service-and-affidavit-workflow",
		title: "Service and Affidavit Workflow",
		subtitle:
			"Coordinating documented service attempts and court-ready affidavit handling for a law-firm assignment.",
		slug: "service-and-affidavit-workflow",
		categories: ["Affidavits", "Service workflow"],
		industries: ["Litigation support"],
		copyright: {
			title: "Need an organized service and affidavit workflow?",
			subtitle:
				"Provide the service packet and select documentation options through the secure intake.",
			ctaText: "Start a Serve",
			ctaLink: "/start",
		},
		tags: ["Attempt updates", "Affidavit", "Court documentation"],
		clientName: "Illustrative service and affidavit workflow",
		clientDescription:
			"A representative workflow for a legal team preparing for clear status updates and proof-of-service handling.",
		featuredImage:
			"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=80",
		thumbnailImage:
			"https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80",
		businessChallenges: [
			"Keep the document packet, service information, and requested affidavit options organized.",
			"Give counsel a documented record of the assignment and attempt information.",
			"Plan for applicable court filing requirements without assuming filing availability.",
		],
		lastModified: new Date("2026-08-31T00:00:00.000Z"),
		howItWorks: processServingWorkflow,
		businessOutcomes: [
			{ title: "Workflow focus", subtitle: "Service-to-affidavit record" },
			{ title: "Documentation focus", subtitle: "Counsel review" },
		],
		solutions: [
			"Record service instructions and documentation preferences in one request.",
			"Review documented attempt information throughout the assignment.",
			"Receive completed service documentation for counsel's review.",
		],
		description:
			"This illustrative scenario focuses on the operational record from secure intake through affidavit documentation. Counsel remains responsible for service requirements, deadlines, and filing decisions.",
		results: [
			{ title: "Attempt record", value: "Documented" },
			{ title: "Documentation", value: "Court-ready" },
			{ title: "Service area", value: "Denver metro" },
		],
	},
	{
		id: "denver-metro-coverage",
		title: "Denver Metro Coverage",
		subtitle:
			"Planning a local process-serving assignment with city, county, and possible service-location context.",
		slug: "denver-metro-coverage",
		categories: ["Denver metro", "Coverage"],
		industries: ["Law firms"],
		copyright: {
			title: "Need local Denver metro service support?",
			subtitle:
				"Start a serve and provide the most complete location and assignment details available.",
			ctaText: "Start a Serve",
			ctaLink: "/start",
		},
		tags: ["Denver", "Service locations", "Court context"],
		clientName: "Illustrative Denver metro coverage workflow",
		clientDescription:
			"A representative workflow for a legal team preparing an assignment across Denver and surrounding metro communities.",
		featuredImage:
			"https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80",
		thumbnailImage:
			"https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=800&q=80",
		businessChallenges: [
			"Provide enough address and access context to support accurate assignment review.",
			"Keep possible locations connected to the correct servee in a multi-recipient matter.",
			"Recognize that local conditions and legal requirements can vary by city, county, and matter.",
		],
		lastModified: new Date("2026-08-31T00:00:00.000Z"),
		howItWorks: processServingWorkflow,
		businessOutcomes: [
			{ title: "Workflow focus", subtitle: "Location-aware intake" },
			{ title: "Service area", subtitle: "Denver metro" },
		],
		solutions: [
			"Associate possible service locations with the appropriate servee.",
			"Record court and deadline context during intake.",
			"Confirm applicable service requirements and coverage details before relying on a timeline.",
		],
		description:
			"This illustrative scenario describes local service planning, not a guarantee of geographic availability, service timing, or legal sufficiency for any particular matter.",
		results: [
			{ title: "Service area", value: "Denver metro" },
			{ title: "Location record", value: "Per-servee" },
			{ title: "Assignment scope", value: "Multi-location" },
		],
	},
];
