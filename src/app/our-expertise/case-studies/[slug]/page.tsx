import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import { denverMetroServeCaseStudies } from "@/data/denverserve/caseStudies";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DenverCaseStudyDetailClient from "./DenverCaseStudyDetailClient";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return denverMetroServeCaseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const study = denverMetroServeCaseStudies.find((item) => item.slug === slug);
	if (!study) return {};
	return {
		title: `${study.title} | Denver Metro Serve`,
		description: study.subtitle,
	};
}

export default async function DenverCaseStudyDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const study = denverMetroServeCaseStudies.find((item) => item.slug === slug);
	if (!study) notFound();

	return (
		<DenverMetroServePage>
			<DenverCaseStudyDetailClient caseStudy={study} />
		</DenverMetroServePage>
	);
}
