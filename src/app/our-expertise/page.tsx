import { ProcessSection } from "@/components/denverserve/Marketing";
import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Denver Process Serving Expertise for Law Firms | Denver Metro Serve",
	description:
		"Denver Metro Serve supports law firms with transparent process serving, service updates, affidavits, and Denver metro coverage.",
};

const topics = [
	{
		title: "Law-firm service workflows",
		copy: "Organize documents, recipients, addresses, service speed, and court information in one secure intake.",
		href: "/how-it-works",
	},
	{
		title: "Difficult and evasive serves",
		copy: "Safety-reviewed service options for assignments that need additional diligence, context, or coordination.",
		href: "/pricing",
	},
	{
		title: "Denver metro coverage",
		copy: "Local service support across Denver and surrounding metro communities.",
		href: "/coverage",
	},
	{
		title: "Case studies",
		copy: "Examples of the types of workflow and service challenges Denver Metro Serve is built to handle.",
		href: "/our-expertise/case-studies",
	},
];

export default function ExpertisePage() {
	return (
		<DenverMetroServePage>
			<section className="mx-auto max-w-7xl px-6 pt-20 pb-12 lg:pt-28 lg:pb-16">
				<p className="font-bold text-[#1f23ae] text-sm uppercase tracking-[0.14em]">
					Our expertise
				</p>
				<h1 className="mt-3 max-w-3xl font-bold text-5xl tracking-tight">
					Process serving built around legal workflows.
				</h1>
				<p className="mt-6 max-w-3xl text-[#454554] text-lg leading-8">
					Denver Metro Serve helps legal teams coordinate service assignments
					with clear intake requirements, documented updates, and court-ready
					affidavit workflows. We do not provide legal advice; counsel remains
					responsible for selecting a lawful service method and managing
					deadlines.
				</p>
			</section>
			<ProcessSection />
			<section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<div className="max-w-3xl">
					<h2 className="font-bold text-3xl">Explore our expertise</h2>
					<p className="mt-3 text-[#454554] leading-7">
						More practical guidance for Denver metro service assignments.
					</p>
				</div>
				<div className="mt-10 grid gap-6 md:grid-cols-2">
					{topics.map((topic) => (
						<Link
							className="hover:-translate-y-1 rounded-xl border border-[#c6c5d6] bg-white p-7 shadow-sm transition hover:border-[#1f23ae]"
							href={topic.href}
							key={topic.href}
						>
							<h2 className="font-bold text-2xl">{topic.title}</h2>
							<p className="mt-3 text-[#454554] leading-7">{topic.copy}</p>
							<span className="mt-5 inline-block font-semibold text-[#1f23ae]">
								Learn more →
							</span>
						</Link>
					))}
				</div>
			</section>
		</DenverMetroServePage>
	);
}
