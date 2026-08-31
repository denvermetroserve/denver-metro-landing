import type { ReactNode } from "react";

export default function DenverMetroServeLayout({
	children,
}: { children: ReactNode }) {
	return <div className="theme-DenverMetroServe">{children}</div>;
}
