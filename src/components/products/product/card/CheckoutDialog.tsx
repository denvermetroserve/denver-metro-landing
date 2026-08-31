import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutDialogProps } from "./types";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	: null;

const CheckoutDialog = ({
	isOpen,
	onClose,
	clientSecret,
	price,
	name,
	description,
	sku,
	categories = [],
}: CheckoutDialogProps) => {
	if (!isOpen || !clientSecret) return null;

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: { theme: "stripe" },
				loader: "auto",
			}}
		>
			<CheckoutForm
				clientSecret={clientSecret}
				onSuccess={onClose}
				plan={{
					id: sku || name,
					name,
					price: {
						oneTime: {
							amount: price,
							description: description ?? "One-time payment",
							features: [],
						},
						monthly: { amount: 0, description: "", features: [] },
						annual: { amount: 0, description: "", features: [] },
					},
					cta: { text: "Complete Purchase", type: "checkout" },
				}}
				planType="oneTime"
				productCategories={categories}
			/>
		</Elements>
	);
};

export default CheckoutDialog;
