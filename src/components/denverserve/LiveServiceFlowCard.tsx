"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import { AnimatePresence, motion } from "framer-motion";
import {
	CheckCircle2,
	Clock3,
	FileCheck2,
	MapPin,
	Navigation,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FlowStep {
	progress: number;
	status: string;
	title: string;
	description: string;
	badge: string;
	badgeVariant: "transit" | "attempt" | "success" | "generating" | "complete";
	icon: typeof MapPin;
	affidavitSubtitle: string;
}

const FLOW_STEPS: FlowStep[] = [
	{
		progress: 0,
		status: "Status: Dispatched",
		title: "Attempt #1 — Arapahoe County",
		description:
			"Server en route to primary service location. GPS tracking active.",
		badge: "In transit · Dispatched",
		badgeVariant: "transit",
		icon: Navigation,
		affidavitSubtitle: "Awaiting service completion...",
	},
	{
		progress: 25,
		status: "Status: Attempt Logged",
		title: "Attempt #1 — Arapahoe County",
		description:
			"First attempt logged at residential address. Recipient not present, vehicle not on site.",
		badge: "Attempt logged · Timestamped",
		badgeVariant: "attempt",
		icon: Clock3,
		affidavitSubtitle: "Verifying GPS & timestamp logs...",
	},
	{
		progress: 50,
		status: "Status: Service Executed",
		title: "Attempt #2 — Denver County",
		description:
			"Defendant located at place of business. Documents handed directly to individual.",
		badge: "Successful service",
		badgeVariant: "success",
		icon: MapPin,
		affidavitSubtitle: "Compiling court return details...",
	},
	{
		progress: 75,
		status: "Status: Generating Proof",
		title: "Attempt #2 — Denver County",
		description:
			"Service completed. Server statement & verification signed under penalty of perjury.",
		badge: "Proof in progress",
		badgeVariant: "generating",
		icon: Sparkles,
		affidavitSubtitle: "Generating notarized proof of service...",
	},
	{
		progress: 100,
		status: "Status: Complete & Ready",
		title: "2nd Judicial District — Denver",
		description:
			"Court-ready return of service generated, verified, and ready for electronic filing.",
		badge: "Ready for court filing",
		badgeVariant: "complete",
		icon: FileCheck2,
		affidavitSubtitle: "Court-ready affidavit completed!",
	},
];

export function LiveServiceFlowCard() {
	const [stepIndex, setStepIndex] = useState(3); // Start at 75% for strong initial impression
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			setStepIndex((prev) => (prev + 1) % FLOW_STEPS.length);
		}, 3200);
		return () => clearInterval(interval);
	}, [isPaused]);

	const current = FLOW_STEPS[stepIndex];

	return (
		<div
			className="relative overflow-hidden rounded-2xl border border-[#c6c5d6]/70 bg-white/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur sm:p-8"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<BorderBeam
				colorFrom="#1f23ae"
				colorTo="#7075ff"
				duration={8}
				size={90}
			/>

			{/* Top Header / Live Indicator */}
			<div className="flex items-center justify-between border-[#c6c5d6] border-b pb-4">
				<div className="flex items-center gap-2">
					<span className="relative flex size-2.5">
						<span
							className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${current.progress === 100 ? "bg-emerald-400" : "bg-[#1f23ae]"}`}
						/>
						<span
							className={`relative inline-flex size-2.5 rounded-full ${current.progress === 100 ? "bg-emerald-500" : "bg-[#1f23ae]"}`}
						/>
					</span>
					<AnimatePresence mode="wait">
						<motion.p
							animate={{ opacity: 1, y: 0 }}
							className="font-semibold text-[#454554] text-sm"
							exit={{ opacity: 0, y: -4 }}
							initial={{ opacity: 0, y: 4 }}
							key={current.status}
							transition={{ duration: 0.25 }}
						>
							{current.status}
						</motion.p>
					</AnimatePresence>
				</div>
				<div className="flex items-center gap-1.5">
					{FLOW_STEPS.map((step, idx) => (
						<button
							aria-label={`Jump to ${step.progress}%`}
							className={`h-1.5 rounded-full transition-all duration-300 ${
								idx === stepIndex
									? "w-6 bg-[#1f23ae]"
									: idx < stepIndex
										? "w-2 bg-[#1f23ae]/40"
										: "w-2 bg-[#c6c5d6]"
							}`}
							key={step.progress}
							onClick={() => setStepIndex(idx)}
							type="button"
						/>
					))}
				</div>
			</div>

			{/* Flow Card Content */}
			<div className="mt-6 space-y-4">
				<div className="relative min-h-[148px] overflow-hidden rounded-xl border border-[#c6c5d6] bg-[#f0f3ff] p-5">
					<AnimatePresence mode="wait">
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							initial={{ opacity: 0, y: 8 }}
							key={current.title + current.badge}
							transition={{ duration: 0.35, ease: "easeOut" }}
						>
							<div className="flex items-center gap-2">
								<current.icon className="size-4 text-[#1f23ae]" />
								<p className="font-semibold text-[#111c2d] text-base">
									{current.title}
								</p>
							</div>
							<p className="mt-2 text-[#454554] text-sm leading-6">
								{current.description}
							</p>
							<div className="mt-3 flex items-center gap-2">
								{current.badgeVariant === "complete" ? (
									<span className="inline-flex items-center gap-1.5 rounded bg-emerald-100 px-2.5 py-1 font-bold text-emerald-800 text-xs uppercase tracking-wide">
										<CheckCircle2 className="size-3.5" />
										{current.badge}
									</span>
								) : current.badgeVariant === "success" ? (
									<span className="inline-flex items-center gap-1.5 rounded bg-[#e0e0ff] px-2.5 py-1 font-bold text-[#1f23ae] text-xs uppercase tracking-wide">
										<CheckCircle2 className="size-3.5" />
										{current.badge}
									</span>
								) : current.badgeVariant === "generating" ? (
									<span className="inline-flex items-center gap-1.5 rounded bg-indigo-100 px-2.5 py-1 font-bold text-indigo-700 text-xs uppercase tracking-wide">
										<Sparkles className="size-3.5 animate-spin" />
										{current.badge}
									</span>
								) : current.badgeVariant === "attempt" ? (
									<span className="inline-flex items-center gap-1.5 rounded bg-amber-100 px-2.5 py-1 font-bold text-amber-800 text-xs uppercase tracking-wide">
										<Clock3 className="size-3.5" />
										{current.badge}
									</span>
								) : (
									<span className="inline-flex items-center gap-1.5 rounded bg-blue-100 px-2.5 py-1 font-bold text-blue-800 text-xs uppercase tracking-wide">
										<Navigation className="size-3.5" />
										{current.badge}
									</span>
								)}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Affidavit Generation Progress Box (0% to 100% in 25% increments) */}
				<div className="rounded-xl border border-[#c6c5d6] bg-white p-5 shadow-xs">
					<div className="flex items-center justify-between font-semibold">
						<span className="text-[#111c2d]">Affidavit generation</span>
						<motion.span
							animate={{ scale: [1, 1.08, 1] }}
							className={`font-bold text-sm ${current.progress === 100 ? "text-emerald-600" : "text-[#1f23ae]"}`}
							key={current.progress}
							transition={{ duration: 0.3 }}
						>
							{current.progress}%
						</motion.span>
					</div>

					{/* Step Progress Bar */}
					<div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#e8eeff]">
						<motion.div
							animate={{ width: `${current.progress}%` }}
							className={`h-full rounded-full transition-colors duration-500 ${
								current.progress === 100
									? "bg-emerald-500"
									: "bg-[#1f23ae]"
							}`}
							initial={false}
							transition={{ duration: 0.6, ease: "easeInOut" }}
						/>
					</div>

					{/* Step Subtitle / Verification State */}
					<div className="mt-2.5 flex items-center justify-between text-xs">
						<AnimatePresence mode="wait">
							<motion.span
								animate={{ opacity: 1 }}
								className="text-[#767685]"
								exit={{ opacity: 0 }}
								initial={{ opacity: 0 }}
								key={current.affidavitSubtitle}
								transition={{ duration: 0.2 }}
							>
								{current.affidavitSubtitle}
							</motion.span>
						</AnimatePresence>
						<span className="font-mono text-[#9898a7]">
							Step {stepIndex + 1}/5
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
