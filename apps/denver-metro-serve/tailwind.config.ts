import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{ts,tsx}", "../../src/**/*.{ts,tsx}"],
	theme: { extend: {} },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
