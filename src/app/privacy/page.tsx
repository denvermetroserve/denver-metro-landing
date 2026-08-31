import { MarkdownContent } from "@/components/legal/markdown";
import { privacyPolicyMarkdown } from "@/data/constants/legal/privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy | Denver Metro Serve",
	description:
		"Learn how Denver Metro Serve handles information submitted through its process-serving website and intake portal.",
};

const PrivacyPolicy = () => {
	return (
		<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			<MarkdownContent
				content={privacyPolicyMarkdown}
				className="prose prose-indigo prose-lg mx-auto"
			/>
		</div>
	);
};

export default PrivacyPolicy;
