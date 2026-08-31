import "@/index.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Denver Metro Serve",
	description:
		"Professional process serving for Denver metro law firms and legal professionals.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="theme-DenverMetroServe min-h-screen bg-background font-sans antialiased">
				{children}
			</body>
		</html>
	);
}
