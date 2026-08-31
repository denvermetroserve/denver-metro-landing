import { MarkdownContent } from "@/components/legal/markdown";
import { serviceLevelAgreementMarkdown } from "@/data/constants/legal/sla";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Service-Level Agreement | Denver Metro Serve",
	description:
		"Denver Metro Serve operational service-level targets and assignment expectations.",
};

export default function ServiceLevelAgreementPage() {
	return (
		<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			<MarkdownContent
				content={serviceLevelAgreementMarkdown}
				className="prose prose-indigo prose-lg mx-auto"
			/>
		</div>
	);
}
