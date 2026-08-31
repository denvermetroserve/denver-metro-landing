import { HomeContent } from "@/components/denverserve/Marketing";
import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Denver Process Servers for Law Firms | DenverMetroServe",
	description:
		"Fast, documented service of process for Denver metro law firms and legal professionals.",
};
export default function DenverMetroServeHomePage() {
	return (
		<DenverMetroServePage>
			<HomeContent />
		</DenverMetroServePage>
	);
}
