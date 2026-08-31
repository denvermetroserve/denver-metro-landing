"use client";

import CaseStudyGrid from "@/components/case-studies/CaseStudyGrid";
import { CTASection } from "@/components/common/CTASection";
import { denverMetroServeCaseStudies } from "@/data/denverserve/caseStudies";

export default function DenverCaseStudiesClient() {
	return (
		<>
			<CaseStudyGrid
				caseStudies={denverMetroServeCaseStudies}
				detailHrefPrefix="/our-expertise/case-studies"
				showCategoryFilter={false}
				subtitle="Illustrative Denver Metro Serve workflows for law firms coordinating service of process. They are not legal advice or guarantees of a service outcome."
				title="Denver Metro Serve Case Studies"
			/>
			<CTASection
				buttonText="Start a Serve"
				description="Submit your documents, recipient details, service locations, and court context in one secure intake."
				href="/start"
				title="Ready to coordinate your next service assignment?"
			/>
		</>
	);
}
