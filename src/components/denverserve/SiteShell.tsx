"use client";

import { ArrowRight, ChevronDown, Menu, Scale, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/how-it-works", label: "How It Works" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/coverage", label: "Coverage" },
	{ href: "/contact", label: "Contact" },
];

const expertiseItems = [
	{ href: "/our-expertise", label: "Our Expertise" },
	{
		href: "/our-expertise/case-studies/law-firm-process-service",
		label: "Law Firm Process Service",
	},
	{
		href: "/our-expertise/case-studies/service-and-affidavit-workflow",
		label: "Service & Affidavit Workflow",
	},
	{
		href: "/our-expertise/case-studies/denver-metro-coverage",
		label: "Denver Metro Coverage",
	},
	{ href: "/our-expertise/case-studies", label: "All Case Studies" },
];

export function DenverMetroServeHeader({
	intake = false,
}: { intake?: boolean }) {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [expertiseOpen, setExpertiseOpen] = useState(false);
	const isActive = (href: string) =>
		href === "/" ? pathname === href : pathname.startsWith(href);

	return (
		<header className="sticky top-0 z-40 border-[#c6c5d6] border-b bg-[#f9f9ff]/90 backdrop-blur">
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
				<Link
					className="flex items-center gap-2 font-bold text-[#1f23ae]"
					href="/"
				>
					<Scale aria-hidden="true" className="size-6" />
					<span className="text-xl">Denver Metro Serve</span>
				</Link>
				{intake ? (
					<Link
						className="font-semibold text-[#454554] text-sm hover:text-[#1f23ae]"
						href="/"
					>
						Exit intake
					</Link>
				) : (
					<>
						<nav
							aria-label="Primary navigation"
							className="hidden items-center gap-4 md:flex"
						>
							{navItems.map((item) => (
								<Link
									aria-current={isActive(item.href) ? "page" : undefined}
									className={`rounded-md px-2 py-2 font-semibold text-sm transition-colors ${isActive(item.href) ? "bg-[#e8eeff] text-[#1f23ae]" : "text-[#454554] hover:bg-[#f0f3ff] hover:text-[#1f23ae]"}`}
									href={item.href}
									key={item.href}
								>
									{item.label}
								</Link>
							))}
							<div className="relative">
								<button
									aria-expanded={expertiseOpen}
									className={`inline-flex items-center gap-1 rounded-md px-2 py-2 font-semibold text-sm transition-colors ${pathname.startsWith("/our-expertise") ? "bg-[#e8eeff] text-[#1f23ae]" : "text-[#454554] hover:bg-[#f0f3ff] hover:text-[#1f23ae]"}`}
									onClick={() => setExpertiseOpen((open) => !open)}
									type="button"
								>
									Our Expertise <ChevronDown className="size-4" />
								</button>
								{expertiseOpen && (
									<div className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-[#c6c5d6] bg-white p-2 shadow-lg">
										{expertiseItems.map((item) => (
											<Link
												className="block rounded-lg px-3 py-2 font-semibold text-[#454554] text-sm hover:bg-[#f0f3ff] hover:text-[#1f23ae]"
												href={item.href}
												key={item.href}
												onClick={() => setExpertiseOpen(false)}
											>
												{item.label}
											</Link>
										))}
									</div>
								)}
							</div>
						</nav>
						<Link
							className="hidden items-center gap-2 rounded-full bg-[#1f23ae] px-5 py-3 font-semibold text-sm text-white shadow-sm transition hover:bg-[#3b41c5] sm:inline-flex"
							href="/start"
						>
							Start a Serve <ArrowRight className="size-4" />
						</Link>
						<button
							aria-controls="DenverMetroServe-mobile-nav"
							aria-expanded={mobileOpen}
							aria-label={
								mobileOpen ? "Close navigation menu" : "Open navigation menu"
							}
							className="rounded-lg p-2 text-[#1f23ae] hover:bg-[#e8eeff] md:hidden"
							onClick={() => setMobileOpen((open) => !open)}
							type="button"
						>
							{mobileOpen ? (
								<X className="size-6" />
							) : (
								<Menu className="size-6" />
							)}
						</button>
					</>
				)}
			</div>
			{!intake && mobileOpen ? (
				<nav
					aria-label="Mobile navigation"
					className="border-[#c6c5d6] border-t bg-[#f9f9ff] px-6 py-4 md:hidden"
					id="DenverMetroServe-mobile-nav"
				>
					<div className="mx-auto flex max-w-7xl flex-col gap-1">
						{navItems.map((item) => (
							<Link
								aria-current={isActive(item.href) ? "page" : undefined}
								className={`rounded-lg px-3 py-3 font-semibold ${isActive(item.href) ? "bg-[#e8eeff] text-[#1f23ae]" : "text-[#454554] hover:bg-[#f0f3ff]"}`}
								href={item.href}
								key={item.href}
								onClick={() => setMobileOpen(false)}
							>
								{item.label}
							</Link>
						))}
						<p className="mt-4 px-3 font-bold text-[#111c2d] text-sm">
							Our Expertise
						</p>
						{expertiseItems.map((item) => (
							<Link
								className="rounded-lg px-3 py-3 font-semibold text-[#454554] hover:bg-[#f0f3ff]"
								href={item.href}
								key={item.href}
								onClick={() => setMobileOpen(false)}
							>
								{item.label}
							</Link>
						))}
						<Link
							className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#1f23ae] px-5 py-3 font-semibold text-white"
							href="/start"
							onClick={() => setMobileOpen(false)}
						>
							Start a Serve <ArrowRight className="size-4" />
						</Link>
					</div>
				</nav>
			) : null}
		</header>
	);
}

export function DenverMetroServeFooter() {
	return (
		<footer className="border-[#c6c5d6] border-t bg-[#d9e3fb] px-6 py-14 text-[#454554] text-sm lg:px-8">
			<div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<Link
						className="flex items-center gap-2 font-bold text-[#1f23ae] text-lg"
						href="/"
					>
						<Scale className="size-5" /> Denver Metro Serve
					</Link>
					<p className="mt-3 max-w-sm">
						Professional, reliable, and transparent process serving for Denver
						metro law firms.
					</p>
					<Link
						className="mt-5 inline-flex items-center font-semibold text-[#1f23ae] hover:underline"
						href="/start"
					>
						Start a Serve <ArrowRight className="ml-1 size-4" />
					</Link>
				</div>
				<FooterLinks
					heading="Services"
					links={[
						{ href: "/how-it-works", label: "How It Works" },
						{ href: "/pricing", label: "Pricing" },
						{ href: "/coverage", label: "Service Coverage" },
					]}
				/>
				<div>
					<p className="font-semibold text-[#111c2d]">Service Areas</p>
					<p className="mt-3 leading-6">
						Denver
						<br />
						Aurora
						<br />
						Lakewood
						<br />
						Arvada
						<br />
						Thornton
					</p>
				</div>
				<FooterLinks
					heading="Company"
					links={[
						{ href: "/contact", label: "Contact" },
						{ href: "/sla", label: "Service-Level Agreement" },
						{ href: "/privacy", label: "Privacy Policy" },
						{ href: "/tos", label: "Terms of Service" },
					]}
				/>
			</div>
			<p className="mx-auto mt-12 max-w-7xl border-[#c6c5d6] border-t pt-6 text-xs">
				&copy; {new Date().getFullYear()} Denver Metro Serve Process Operations.
				All rights reserved.
			</p>
		</footer>
	);
}

function FooterLinks({
	heading,
	links,
}: { heading: string; links: { href: string; label: string }[] }) {
	return (
		<div>
			<p className="font-semibold text-[#111c2d]">{heading}</p>
			<ul className="mt-3 space-y-2">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							className="hover:text-[#1f23ae] hover:underline"
							href={link.href}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export function DenverMetroServePage({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-[#f9f9ff] text-[#111c2d]">
			<DenverMetroServeHeader />
			<main>{children}</main>
			<DenverMetroServeFooter />
		</div>
	);
}
