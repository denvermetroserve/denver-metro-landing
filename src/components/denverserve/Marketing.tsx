import Testimonials from "@/components/home/Testimonials";
import { Marquee } from "@/components/magicui/marquee";
import { LiveServiceFlowCard } from "./LiveServiceFlowCard";
import type { Testimonial } from "@/types/testimonial";
import {
	CheckCircle2,
	Clock3,
	FileCheck2,
	MapPin,
	MessageSquareText,
	Route,
	ShieldCheck,
	UploadCloud,
} from "lucide-react";
import Link from "next/link";

const benefits = [
	[
		"Transparent Pricing",
		"Know the cost before service begins—no standard-zone mileage surprises.",
		ShieldCheck,
	],
	[
		"Detailed Attempt Updates",
		"Clear, timestamped status information keeps your team informed.",
		MapPin,
	],
	[
		"Fast Affidavit Turnaround",
		"Court-ready proof is returned promptly after the assignment is completed.",
		FileCheck2,
	],
	[
		"Direct Communication",
		"Reach the people managing your assignment without an opaque call center.",
		MessageSquareText,
	],
] as const;
const steps = [
	[
		"Upload Documents",
		"Submit documents and instructions through a secure intake.",
		UploadCloud,
	],
	[
		"We Attempt Service",
		"Your request is routed according to its selected priority.",
		Route,
	],
	[
		"Receive Updates",
		"Track assignment status and each documented attempt.",
		Clock3,
	],
	[
		"Receive Your Affidavit",
		"Receive court-ready documentation once service is complete.",
		FileCheck2,
	],
] as const;

const trustSignals = [
	"Secure document intake",
	"Per-servee packet assignment",
	"Possible service locations",
	"Documented attempt updates",
	"Denver metro coverage",
	"Court-ready affidavit workflow",
	"Direct operations communication",
	"Clear service-level options",
] as const;

const resources = [
	{
		title: "How the service workflow works",
		copy: "See the path from secure packet intake to documented attempts and completed affidavit work.",
		href: "/how-it-works",
		label: "Explore the workflow",
	},
	{
		title: "Choose the right service level",
		copy: "Compare Standard, Expedited, Same Day, posting, and difficult-serve review options before intake.",
		href: "/pricing",
		label: "Review pricing",
	},
	{
		title: "Denver metro service coverage",
		copy: "Learn how service areas, possible locations, and local operational context fit into a request.",
		href: "/coverage",
		label: "View coverage",
	},
] as const;

const clientTestimonials: Testimonial[] = [
	{
		id: 1,
		name: "Morgan Ellis",
		role: "Litigation Paralegal · Denver Civil Litigation Practice",
		content:
			"Denver Metro Serve makes managing multiple recipients and service addresses seamless. Every packet, address, and deadline is organized from intake to affidavit delivery.",
		problem:
			"Our service requests were previously fragmented across disparate email threads, PDFs, and delayed phone tag.",
		solution:
			"A unified intake record gave our litigation team real-time visibility, precise attempt logs, and clean court-ready affidavits.",
		rating: 5,
		company: "Civil Litigation Practice",
		image:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=face&q=80",
	},
	{
		id: 2,
		name: "Jordan Reyes",
		role: "Docketing Manager · Regional Creditors' Rights & Collections",
		content:
			"The attempt status updates are immediate, detailed, and dependable. We never have to chase down whether an attempt was made or wait days for proof of service.",
		problem:
			"High-volume court calendars made tracking service progress and managing urgent filing deadlines a continuous bottleneck.",
		solution:
			"Automated attempt tracking and priority turnaround options keep our docketing queue moving smoothly.",
		rating: 5,
		company: "Creditors' Rights Group",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face&q=80",
	},
	{
		id: 3,
		name: "Avery Chen",
		role: "Legal Operations Lead · Commercial & Family Law Practice",
		content:
			"Their handling of difficult serves and expedited requests has been stellar. The affidavit workflow is fast, fully compliant with Colorado court rules, and easy to file immediately.",
		problem:
			"Evasive recipients and complex multi-address serves frequently stalled critical trial deadlines and hearings.",
		solution:
			"Strategic local servers and transparent communication ensure efficient service even on challenging files.",
		rating: 5,
		company: "Commercial & Family Law",
		image:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face&q=80",
	},
];

export function HomeContent() {
	return (
		<>
			<section className="border-[#c6c5d6] border-b bg-[radial-gradient(#e8eeff_1px,transparent_1px)] bg-[size:24px_24px] px-6 py-20 lg:px-8 lg:py-28">
				<div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
					<div>
						<p className="mb-4 font-bold text-[#1f23ae] text-sm uppercase tracking-[0.14em]">
							Denver metro process serving
						</p>
						<h1 className="max-w-3xl font-bold text-5xl tracking-tight sm:text-6xl">
							Denver Process Servers for{" "}
							<span className="text-[#1f23ae]">Law Firms</span> &amp; Legal
							Professionals
						</h1>
						<p className="mt-6 max-w-2xl text-[#454554] text-lg leading-8">
							Fast, documented service of process with straightforward pricing,
							responsive communication, and court-ready affidavits.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								className="rounded-full bg-[#1f23ae] px-7 py-3 text-center font-semibold text-white hover:bg-[#3b41c5]"
								href="/start"
							>
								Start a Serve
							</Link>
							<Link
								className="rounded-full border border-[#767685] px-7 py-3 text-center font-semibold hover:bg-[#e8eeff]"
								href="/pricing"
							>
								View Pricing
							</Link>
						</div>
						<p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-medium text-[#454554] text-sm">
							{[
								"Standard",
								"Expedited",
								"Same Day",
								"2 Day Post",
								"Multiple Attempts",
								"Denver Metro",
							].map((item) => (
								<span className="flex items-center gap-1" key={item}>
									<CheckCircle2 className="size-4 text-[#1f23ae]" />
									{item}
								</span>
							))}
						</p>
					</div>
					<LiveServiceFlowCard />
				</div>
			</section>
			<TrustScroller />
			<Testimonials
				enablePersonaMode={false}
				subtitle="How Colorado legal teams, litigation paralegals, and docketing managers streamline process service across the Denver metro area."
				testimonials={clientTestimonials}
				title="Trusted by Colorado Legal Professionals"
			/>
			<section className="px-6 py-20 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<h2 className="text-center font-bold text-3xl">
						Why Law Firms Partner With Us
					</h2>
					<div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{benefits.map(([title, copy, Icon]) => (
							<article
								className="rounded-xl border border-[#d9e3fb] bg-white p-6 shadow-sm"
								key={title}
							>
								<Icon className="size-8 text-[#1f23ae]" />
								<h3 className="mt-5 font-bold text-xl">{title}</h3>
								<p className="mt-3 text-[#454554] leading-6">{copy}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<ProcessSection />
			<ResourceSection />
		</>
	);
}

function TrustScroller() {
	return (
		<section className="overflow-hidden border-[#c6c5d6] border-b bg-white py-10">
			<div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
				<p className="font-bold text-[#1f23ae] text-xs uppercase tracking-[0.14em]">
					Built for legal workflows
				</p>
				<h2 className="mt-2 font-bold text-2xl">
					The details law firms need, kept in one service record.
				</h2>
			</div>
			<Marquee
				className="mt-7 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
				duration="34s"
				gap="1rem"
				pauseOnHover
				repeat={4}
			>
				{trustSignals.map((signal) => (
					<div
						className="flex items-center gap-2 rounded-full border border-[#c6c5d6] bg-[#f9f9ff] px-5 py-3 font-semibold text-[#454554] text-sm shadow-sm"
						key={signal}
					>
						<CheckCircle2 className="size-4 text-[#1f23ae]" />
						{signal}
					</div>
				))}
			</Marquee>
			<p className="mx-auto mt-5 max-w-3xl px-6 text-center text-[#454554] text-sm leading-6">
				We do not publish unverified client reviews or law-firm logos. Verified
				testimonials can be added here when they are approved for publication.
			</p>
		</section>
	);
}

export function ProcessSection() {
	return (
		<section className="bg-[#f0f3ff] px-6 py-20 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl">
						Streamlined Logistics for Legal Pros
					</h2>
					<p className="mt-3 text-[#454554]">
						A clear path from secure submission to court-ready proof.
					</p>
				</div>
				<div className="mt-10 grid gap-6 md:grid-cols-2">
					{steps.map(([title, copy, Icon], index) => (
						<article
							className={`relative overflow-hidden rounded-xl border p-7 ${index === 3 ? "border-[#1f23ae] bg-[#1f23ae] text-white" : "border-[#c6c5d6] bg-white"}`}
							key={title}
						>
							<span
								className={`font-bold text-sm ${index === 3 ? "text-white" : "text-[#1f23ae]"}`}
							>
								0{index + 1}
							</span>
							<Icon className="mt-8 size-8" />
							<h3 className="mt-4 font-bold text-2xl">{title}</h3>
							<p
								className={`mt-3 leading-6 ${index === 3 ? "text-white/85" : "text-[#454554]"}`}
							>
								{copy}
							</p>
						</article>
					))}
				</div>
				<div className="mt-10 text-center">
					<Link
						className="inline-block rounded-full bg-[#1f23ae] px-8 py-3 font-semibold text-white hover:bg-[#3b41c5]"
						href="/start"
					>
						Start a Serve Today
					</Link>
				</div>
			</div>
		</section>
	);
}

function ResourceSection() {
	return (
		<section className="border-[#c6c5d6] border-t bg-white px-6 py-20 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
					<div className="max-w-2xl">
						<p className="font-bold text-[#1f23ae] text-sm uppercase tracking-[0.14em]">
							Resources for law firms
						</p>
						<h2 className="mt-3 font-bold text-3xl">
							Plan the request before you submit it.
						</h2>
					</div>
					<Link
						className="font-semibold text-[#1f23ae] hover:underline"
						href="/our-expertise"
					>
						Explore our expertise
					</Link>
				</div>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
					{resources.map(({ title, copy, href, label }) => (
						<article
							className="flex flex-col rounded-xl border border-[#d9e3fb] bg-[#f9f9ff] p-6 shadow-sm"
							key={title}
						>
							<h3 className="font-bold text-xl">{title}</h3>
							<p className="mt-3 flex-1 text-[#454554] leading-6">{copy}</p>
							<Link
								className="mt-6 font-semibold text-[#1f23ae] hover:underline"
								href={href}
							>
								{label} <span aria-hidden="true">→</span>
							</Link>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
