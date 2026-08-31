import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Denver Process Servers for Law Firms | DenverMetroServe",
	description:
		"Fast, documented service of process for Denver metro law firms and legal professionals.",
	keywords: [
		"Denver process server",
		"service of process",
		"legal process serving",
	],
	openGraph: {
		title: "Denver Process Servers for Law Firms | DenverMetroServe",
		description:
			"Fast, documented service of process for Denver metro law firms and legal professionals.",
		url: "/",
		type: "website",
		siteName: "DenverMetroServe",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Denver Process Servers for Law Firms | DenverMetroServe",
		description:
			"Fast, documented service of process for Denver metro law firms and legal professionals.",
	},
	metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3555"),
};
