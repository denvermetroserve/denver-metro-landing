"use client";

import { CaseStudyBusinessOutcome } from "@/components/case-studies/CaseStudyBusinessOutcome";
import CaseStudyContent from "@/components/case-studies/CaseStudyContent";
import CaseStudyDetailHeader from "@/components/case-studies/CaseStudyDetailHeader";
import { CTASection } from "@/components/common/CTASection";
import HowItWorksCarousel from "@/components/services/HowItWorksCarousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import type { CaseStudy } from "@/types/case-study";

export default function DenverCaseStudyDetailClient({
	caseStudy,
}: { caseStudy: CaseStudy }) {
	return (
		<>
			<CaseStudyDetailHeader
				backHref="/our-expertise/case-studies"
				backLabel="Back to Denver Metro Serve Case Studies"
				caseStudy={caseStudy}
			/>
			<CaseStudyContent caseStudy={caseStudy} />
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			<CaseStudyBusinessOutcome caseStudy={caseStudy} />
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			{caseStudy.howItWorks?.length ? (
				<section className="container py-10">
					<SectionHeading
						centered
						description="Explore the animated operational workflow for this illustrative process-serving scenario."
						title="How It Works"
					/>
					<div className="mt-8">
						<HowItWorksCarousel howItWorks={caseStudy.howItWorks} />
					</div>
				</section>
			) : null}
			<CTASection
				buttonText="Start a Serve"
				description={caseStudy.copyright.subtitle}
				href="/start"
				title={caseStudy.copyright.title}
			/>
		</>
	);
}
