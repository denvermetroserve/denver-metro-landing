import Script from "next/script";
import "../index.css";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import type { AnalyticsConfig } from "@/lib/analytics/config";
import { getAnalyticsConfig } from "@/lib/analytics/config";
import { monoFont, sansFont } from "@/styles/fonts";
import { SchemaInjector, buildKnowledgeGraphSchema } from "@/utils/seo/schema";

const KNOWLEDGE_GRAPH_SCHEMA = buildKnowledgeGraphSchema();

const analyticsResult = getAnalyticsConfig();

if (analyticsResult.warnings.length > 0) {
	// * Surface configuration issues early in the server logs.
	console.warn(
		"[layout] Analytics configuration warnings",
		analyticsResult.warnings,
	);
}

const initialAnalyticsConfig: AnalyticsConfig = analyticsResult.config;
const {
	clarityId: clarityProjectId,
	zohoCode: zohoWidgetCode,
	facebookPixelId,
	plausibleDomain,
	plausibleEndpoint,
	plausibleScriptSrc,
} = initialAnalyticsConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${sansFont.variable} ${monoFont.variable}`}
			suppressHydrationWarning
		>
			<head>
				<Script id="lo-attribution-capture" strategy="afterInteractive">
					{`(function () {
  const keys = ["gclid","wbraid","gbraid","utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","msclkid","utm_icp"];
  const url = new URL(window.location.href);
  const found = {};
  keys.forEach(k => { const v = url.searchParams.get(k); if (v) found[k] = v; });

  if (Object.keys(found).length) {
    const existing = JSON.parse(localStorage.getItem("lo_attrib") || "{}");
    localStorage.setItem("lo_attrib", JSON.stringify({ ...found, ...existing, ts: Date.now() }));
  }
})();`}
				</Script>
				<Script id="whatconverts-init" strategy="afterInteractive">
					{
						"var $wc_load=function(a){return JSON.parse(JSON.stringify(a))}; var $wc_leads=$wc_leads||{doc:{url:$wc_load(document.URL), ref:$wc_load(document.referrer), search:$wc_load(location.search), hash:$wc_load(location.hash)}};"
					}
				</Script>
				<Script
					src="//s.ksrndkehqnwntyxlhgto.com/162476.js"
					strategy="afterInteractive"
				/>
			</head>
			<body className="theme-DenverMetroServe min-h-screen bg-background font-sans antialiased">
				<SchemaInjector schema={KNOWLEDGE_GRAPH_SCHEMA} />
				<AppProviders
					clarityProjectId={clarityProjectId}
					zohoWidgetCode={zohoWidgetCode}
					facebookPixelId={facebookPixelId}
					plausibleDomain={plausibleDomain}
					plausibleEndpoint={plausibleEndpoint}
					plausibleScriptSrc={plausibleScriptSrc}
					initialAnalyticsConfig={initialAnalyticsConfig}
				>
					{children}
				</AppProviders>
			</body>
		</html>
	);
}
