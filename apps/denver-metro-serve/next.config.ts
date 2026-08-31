import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
	images: {
		remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
	},
};

export default nextConfig;
