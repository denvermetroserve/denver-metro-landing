"use client";

import { DenverMetroServePage } from "@/components/denverserve/SiteShell";
import { Mail, Phone, Send } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

export default function ContactPage() {
	const [sent, setSent] = useState(false);
	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSent(true);
	}
	return (
		<DenverMetroServePage>
			<section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<header className="max-w-3xl">
					<h1 className="font-bold text-5xl tracking-tight">
						Direct Communication.
					</h1>
					<p className="mt-5 text-[#454554] text-lg leading-8">
						Connect directly with the operations team managing your Denver legal
						logistics.
					</p>
				</header>
				<div className="mt-12 grid gap-8 lg:grid-cols-12">
					<form
						className="rounded-xl border border-[#c6c5d6] bg-white p-7 shadow-sm lg:col-span-7"
						onSubmit={submit}
					>
						<h2 className="font-bold text-2xl">Inquiry Form</h2>
						<div className="mt-6 grid gap-5 md:grid-cols-2">
							<Field label="Name" name="name" required />
							<Field label="Law Firm / Organization" name="firm" />
						</div>
						<div className="mt-5">
							<Field label="Email address" name="email" type="email" required />
						</div>
						<label className="mt-5 block font-semibold text-sm">
							Message / logistics inquiry
							<textarea
								className="mt-2 min-h-32 w-full rounded-lg border border-[#767685] p-3 outline-none focus:border-[#1f23ae] focus:ring-2 focus:ring-[#1f23ae]/20"
								name="message"
								required
							/>
						</label>
						<button
							className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1f23ae] px-6 py-3 font-semibold text-white hover:bg-[#3b41c5]"
							type="submit"
						>
							<Send className="size-4" /> Send inquiry
						</button>
						{sent && (
							<p className="mt-4 font-semibold text-[#1f23ae] text-sm">
								Thanks—your message is ready to connect to the production
								contact endpoint.
							</p>
						)}
					</form>
					<aside className="space-y-5 lg:col-span-5">
						<Info
							icon={<Phone className="size-6" />}
							title="Direct Line"
							value="(720) 555-0198"
						/>
						<Info
							icon={<Mail className="size-6" />}
							title="Operations Email"
							value="ops@DenverMetroServe.com"
						/>
						<div className="rounded-xl border border-[#c6c5d6] bg-[#f0f3ff] p-6">
							<h2 className="font-bold text-xl">Hours of Operation</h2>
							<dl className="mt-4 space-y-3 text-[#454554]">
								<div className="flex justify-between gap-4">
									<dt>Monday–Friday</dt>
									<dd>8 AM–6 PM MT</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt>Saturday</dt>
									<dd>9 AM–1 PM MT</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt>Sunday</dt>
									<dd>Emergency ops only</dd>
								</div>
							</dl>
						</div>
					</aside>
				</div>
			</section>
		</DenverMetroServePage>
	);
}
function Field({
	label,
	name,
	type = "text",
	required = false,
}: { label: string; name: string; type?: string; required?: boolean }) {
	return (
		<label className="block font-semibold text-sm">
			{label}
			<input
				className="mt-2 h-12 w-full rounded-lg border border-[#767685] px-3 outline-none focus:border-[#1f23ae] focus:ring-2 focus:ring-[#1f23ae]/20"
				name={name}
				required={required}
				type={type}
			/>
		</label>
	);
}
function Info({
	icon,
	title,
	value,
}: { icon: ReactNode; title: string; value: string }) {
	return (
		<div className="rounded-xl border border-[#c6c5d6] bg-white p-6">
			<div className="text-[#1f23ae]">{icon}</div>
			<p className="mt-4 font-bold text-[#454554] text-sm uppercase tracking-wide">
				{title}
			</p>
			<p className="mt-1 font-bold text-xl">{value}</p>
		</div>
	);
}
