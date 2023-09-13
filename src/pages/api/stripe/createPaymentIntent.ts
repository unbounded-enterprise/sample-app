import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { CreatePaymentIntentProps } from "src/types/stripe";
import { errorHandling } from "../validate";
import Stripe from 'stripe';
// import { getUser } from "../user/info";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });

export default function createPaymentIntentHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { amount } = req.body;
			
			if (!amount) throw new BasicError('missing amount', 409);

			createPaymentIntent({ amount })
				.then((data) => resolve(res.status(200).json(data)))
				.catch(handleError);
		} catch(e:any) {
			handleError(e);
		}
	})
}

export async function createPaymentIntent(props:CreatePaymentIntentProps): Promise<any> {
	const paymentIntentParams = {
	  amount: props.amount * 100,
	  currency: 'usd',
	  automatic_payment_methods: { enabled: true },
	};

	const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

	return paymentIntent;
}