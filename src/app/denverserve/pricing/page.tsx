import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import {
	CheckCircle2,
	Eye,
	FileCheck2,
	Mail,
	MapPin,
	Search,
	Ticket,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const tiers = [
	{
		name: "Standard",
		price: 100,
		copy: "Standard turnaround for general service.",
		points: [
			"3–5 day completion target",
			"First attempt within 48 hours",
			"Up to 4 attempts included",
			"Real-time status updates",
		],
	},
	{
		name: "Expedited",
		price: 145,
		copy: "Accelerated timeline for pressing matters.",
		points: [
			"1–2 day completion target",
			"First attempt within 24 hours",
			"Up to 4 attempts included",
			"Priority support routing",
		],
		popular: true,
	},
	{
		name: "Same Day",
		price: 190,
		copy: "Urgent service for complete assignments accepted before 2 PM local.",
		points: [
			"First attempt the same day when a server is available",
			"All attempts within 24 hours of acceptance",
			"For complete assignments accepted before 2 PM local",
			"Priority communication on the assignment",
		],
	},
	{
		name: "2 Day Post",
		price: 55,
		copy: "Posting service when posting is authorized by law or court order.",
		points: [
			"Documents posted on the door",
			"Completed within 2 days of job acceptance",
			"Documented posting confirmation",
			"Subject to legal or court authorization",
		],
	},
];

const difficultServe = {
	name: "Difficult Serve",
	price: 295,
	copy: "Safety-reviewed service for evasive or heightened-risk assignments.",
	points: [
		"Assignment-specific operational review",
		"Safety concerns reviewed before acceptance",
		"Coordination tailored to lawful service opportunities",
		"No standard completion target applies",
	],
};

const enhancements = [
	{
		title: "Witness Fee",
		price: "Amount or calculated fee",
		copy: "Include a witness fee check with a subpoena serve. Enter an amount, or ask Denver Metro Serve to calculate the fee at review.",
		Icon: Ticket,
	},
	{
		title: "Skiptrace",
		price: "$75 if used",
		copy: "Authorize an automatic skiptrace only if a bad address makes it necessary.",
		Icon: Search,
	},
	{
		title: "E-Filing Integration",
		price: "+$20",
		copy: "Direct submission of a return of service where available. Completed affidavits are automatically filed in the respective county.",
		Icon: FileCheck2,
	},
	{
		title: "Mailed Affidavit",
		price: "+$15",
		copy: "Receive a physical notarized copy via USPS.",
		Icon: Mail,
	},
	{
		title: "Stakeout Service",
		price: "$100 / hour",
		copy: "Stationary observation at a lawful location to identify a service opportunity. Every request is subject to safety review.",
		Icon: Eye,
	},
	{
		title: "Mailing",
		price: "$5 or $25",
		copy: "Choose first-class mailing for $5 or certified mailing with tracking for $25, then choose always mail or service-outcome mailing.",
		Icon: MapPin,
	},
] as const;
export const metadata: Metadata = {
	title: "Process Serving Pricing | Denver Metro Serve",
	description:
		"Transparent Denver metro process-serving pricing and optional workflow enhancements.",
};
export default function PricingPage() {
	return (
		<DenverMetroServePage>
			<section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<header className="mx-auto max-w-3xl text-center">
					<h1 className="font-bold text-5xl tracking-tight">
						Transparent Pricing. Uncompromising Speed.
					</h1>
					<p className="mt-5 text-[#454554] text-lg leading-8">
						Flat-rate process serving tailored to the pace of your litigation.
						No hidden fees within standard zones.
					</p>
				</header>
				<div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{tiers.map((tier) => (
						<article
							className={`relative flex flex-col rounded-xl border bg-white p-8 shadow-sm ${tier.popular ? "md:-translate-y-4 border-2 border-[#1f23ae]" : "border-[#c6c5d6]"}`}
							key={tier.name}
						>
							{tier.popular && (
								<span className="absolute top-0 right-0 rounded-bl-xl bg-[#1f23ae] px-4 py-1 font-bold text-white text-xs uppercase tracking-wide">
									Most popular
								</span>
							)}
							<h2
								className={`font-bold text-2xl ${tier.popular ? "text-[#1f23ae]" : ""}`}
							>
								{tier.name}
							</h2>
							<p className="mt-3 min-h-12 text-[#454554]">{tier.copy}</p>
							<p className="mt-8 font-bold text-5xl">
								${tier.price}
								<span className="font-normal text-[#454554] text-sm">
									{" "}
									/ servee
								</span>
							</p>
							<ul className="my-8 flex-1 space-y-4">
								{tier.points.map((point) => (
									<li className="flex gap-2 text-sm" key={point}>
										<CheckCircle2 className="size-5 shrink-0 text-[#1f23ae]" />
										{point}
									</li>
								))}
							</ul>
							<Link
								className={`rounded-lg px-5 py-3 text-center font-semibold ${tier.popular ? "bg-[#1f23ae] text-white hover:bg-[#3b41c5]" : "border border-[#767685] hover:bg-[#f0f3ff]"}`}
								href="/start"
							>
								Select {tier.name}
							</Link>
						</article>
					))}
				</div>
				<section className="mx-auto mt-8 max-w-3xl">
					<article className="grid gap-6 rounded-xl border-2 border-[#1f23ae] bg-[#f0f3ff] p-8 md:grid-cols-[1fr_auto] md:items-center">
						<div>
							<p className="font-bold text-[#1f23ae] text-xs uppercase tracking-[0.14em]">
								Special handling
							</p>
							<h2 className="mt-2 font-bold text-2xl">{difficultServe.name}</h2>
							<p className="mt-2 text-[#454554]">{difficultServe.copy}</p>
							<ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
								{difficultServe.points.map((point) => (
									<li className="flex gap-2" key={point}>
										<CheckCircle2 className="size-5 shrink-0 text-[#1f23ae]" />
										{point}
									</li>
								))}
							</ul>
						</div>
						<div className="text-left md:text-right">
							<p className="font-bold text-4xl">${difficultServe.price}</p>
							<p className="mt-1 text-[#454554] text-sm">per servee</p>
							<Link
								className="mt-4 inline-block rounded-lg bg-[#1f23ae] px-5 py-3 font-semibold text-white hover:bg-[#3b41c5]"
								href="/start"
							>
								Request review
							</Link>
						</div>
					</article>
				</section>
				<section className="mx-auto mt-20 max-w-6xl">
					<h2 className="text-center font-bold text-3xl">
						Workflow Enhancements
					</h2>
					<p className="mx-auto mt-3 max-w-3xl text-center text-[#454554] leading-7">
						Choose these optional services during intake. Pricing is shown
						before you proceed to secure payment.
					</p>
					<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{enhancements.map(({ title, price, copy, Icon }) => (
							<article
								className="rounded-xl border border-[#c6c5d6] bg-white p-6"
								key={title}
							>
								<div className="flex items-start justify-between gap-4">
									<Icon className="size-7 text-[#1f23ae]" />
									<span className="shrink-0 font-bold text-[#1f23ae] text-sm">
										{price}
									</span>
								</div>
								<h3 className="mt-5 font-bold text-xl">{title}</h3>
								<p className="mt-2 text-[#454554] leading-6">{copy}</p>
							</article>
						))}
					</div>
					<div className="mt-10 text-center">
						<Link
							className="inline-block rounded-full bg-[#1f23ae] px-8 py-3 font-semibold text-white hover:bg-[#3b41c5]"
							href="/start"
						>
							Build your service request
						</Link>
					</div>
				</section>
			</section>
		</DenverMetroServePage>
	);
}
