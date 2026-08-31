"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Suspense, useEffect, useMemo, useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { AnalyticsConsentProvider } from "@/contexts/analytics-consent-context";
import { ThemeProvider } from "@/contexts/theme-context";

import type { AnalyticsConfig } from "@/lib/analytics/config";

import { ChunkErrorHandler } from "./ChunkErrorHandler";
import NextAuthProvider from "./NextAuthProvider";

const SuspenseFallback = () => (
	<div className="min-h-screen w-full bg-slate-950 text-white">
		<div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
			<div className="animate-spin rounded-full border-2 border-white/30 border-t-transparent p-3" />
			<p className="font-semibold text-white/70 text-xs uppercase tracking-[0.3em]">
				Preparing interface
			</p>
		</div>
	</div>
);

interface AppProvidersProps {
	children: ReactNode;
	clarityProjectId?: string;
	zohoWidgetCode?: string;
	facebookPixelId?: string;
	plausibleDomain?: string;
	plausibleEndpoint?: string;
	plausibleScriptSrc?: string;
	initialAnalyticsConfig?: Partial<AnalyticsConfig>;
}

const ClientExperience = dynamic(
	() =>
		import("./ClientExperience").then((mod) => ({
			default: mod.ClientExperience,
		})),
	{ ssr: false, loading: () => null },
);

export function AppProviders({
	children,
	clarityProjectId,
	zohoWidgetCode,
	facebookPixelId,
	plausibleDomain,
	plausibleEndpoint,
	plausibleScriptSrc,
	initialAnalyticsConfig,
}: AppProvidersProps) {
	const [queryClient] = useState(() => new QueryClient());

	// Check if autoload is explicitly enabled
	const explicitAutoload =
		process.env.NEXT_PUBLIC_ANALYTICS_AUTOLOAD === "true";

	// Fallback: If autoload variable is undefined but GA ID is present, enable autoload
	// This provides a safety net if the variable is missing but analytics should load
	const hasGoogleAnalytics = Boolean(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS);
	const hasFacebookPixelConfig = Boolean(
		facebookPixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
	);
	const defaultAnalyticsConsent =
		explicitAutoload ||
		(process.env.NEXT_PUBLIC_ANALYTICS_AUTOLOAD === undefined &&
			(hasGoogleAnalytics || hasFacebookPixelConfig));

	// Verify environment variables at runtime (using console.warn so it's visible in production)
	useEffect(() => {
		const usingFallback =
			process.env.NEXT_PUBLIC_ANALYTICS_AUTOLOAD === undefined &&
			(hasGoogleAnalytics || hasFacebookPixelConfig);
		console.warn("[AppProviders] Environment Variables Check:", {
			NEXT_PUBLIC_ANALYTICS_AUTOLOAD:
				process.env.NEXT_PUBLIC_ANALYTICS_AUTOLOAD,
			NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
			NEXT_PUBLIC_FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
			defaultAnalyticsConsent,
			explicitAutoload,
			usingFallback,
			type_AUTOLOAD: typeof process.env.NEXT_PUBLIC_ANALYTICS_AUTOLOAD,
			type_GA: typeof process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
		});
		if (usingFallback) {
			console.warn(
				"[AppProviders] WARNING: NEXT_PUBLIC_ANALYTICS_AUTOLOAD is undefined. Using fallback: enabling autoload because NEXT_PUBLIC_GOOGLE_ANALYTICS or NEXT_PUBLIC_FACEBOOK_PIXEL_ID is present. Please set NEXT_PUBLIC_ANALYTICS_AUTOLOAD=true in production environment.",
			);
		}
	}, [
		defaultAnalyticsConsent,
		explicitAutoload,
		hasGoogleAnalytics,
		hasFacebookPixelConfig,
	]);

	const analyticsProps = useMemo(
		() => ({
			clarityProjectId,
			zohoWidgetCode,
			facebookPixelId,
			plausibleDomain,
			plausibleEndpoint,
			plausibleScriptSrc,
			initialAnalyticsConfig,
		}),
		[
			clarityProjectId,
			facebookPixelId,
			initialAnalyticsConfig,
			plausibleDomain,
			plausibleEndpoint,
			plausibleScriptSrc,
			zohoWidgetCode,
		],
	);

	return (
		<AnalyticsConsentProvider defaultConsent={defaultAnalyticsConsent}>
			<ThemeProvider>
				<ChunkErrorHandler />
				<Suspense fallback={<SuspenseFallback />}>
					<Toaster />
					<NextAuthProvider>
						<QueryClientProvider client={queryClient}>
							{children}
						</QueryClientProvider>
					</NextAuthProvider>
				</Suspense>
				<ClientExperience {...analyticsProps} />
			</ThemeProvider>
		</AnalyticsConsentProvider>
	);
}
