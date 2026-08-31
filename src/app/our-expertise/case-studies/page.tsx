import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import type { Metadata } from "next";
import DenverCaseStudiesClient from "./DenverCaseStudiesClient";

export const metadata: Metadata = {
	title: "Denver Process Serving Case Studies | Denver Metro Serve",
	description:
		"See the law-firm process-serving workflow scenarios Denver Metro Serve is designed to support across the Denver metro.",
};

export default function CaseStudiesPage() {
	return (
		<DenverMetroServePage>
			<DenverCaseStudiesClient />
		</DenverMetroServePage>
	);
}
