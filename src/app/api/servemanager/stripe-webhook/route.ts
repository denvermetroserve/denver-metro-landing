import { verifyWebhook } from "@/lib/externalRequests/stripe";
import { serveManager } from "@/lib/servemanager/client";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
	const signature = request.headers.get("stripe-signature");
	if (!signature)
		return NextResponse.json(
			{ error: "Missing Stripe signature." },
			{ status: 400 },
		);

	try {
		const event = await verifyWebhook(signature, await request.text());
		if (event.type === "payment_intent.succeeded") {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			const jobId = paymentIntent.metadata.servemanager_job_id;
			if (jobId) {
				await serveManager.updateJob(jobId, {
					job_status:
						process.env.SERVEMANAGER_PAID_JOB_STATUS ||
						process.env.SERVEMANAGER_INITIAL_JOB_STATUS ||
						"On Hold",
					client_transaction_ref: paymentIntent.id,
				});
			}
		}
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("ServeManager payment webhook failed", error);
		return NextResponse.json(
			{ error: "Webhook processing failed." },
			{ status: 400 },
		);
	}
}
