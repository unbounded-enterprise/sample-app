import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from "src/types/error";
import { errorHandling } from "../validate";
import Stripe from 'stripe';
// import { MongoClient } from 'mongodb';
import { RolltopiaBundle } from "src/types/shop";
// import { getUser } from "../user/info";

// const mdb = new MongoClient(process.env.MONGO_ENDPOINT || "");
// const dbInvoices = mdb.db('rolltopia').collection('invoices');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });
export const rolltopiaBundles = {
  '0': {
    id: '0',
    price: 1.89,
    quantity: 5000,
  },
  '1': {
    id: '1',
    price: 8.99,
    quantity: 25000,
  },
  '2': {
    id: '2',
    price: 39.99,
    quantity: 100000,
  },
  '3': {
    id: '3',
    price: 149.99,
    quantity: 500000,
  },
};

export function createBundleMetadata(userId: string, bundle: RolltopiaBundle) {
	return {
		userId,
		bundleId: "" + bundle.id,
		price: "" + bundle.price,
		quantity: "" + bundle.quantity,
	}
}

export default function createPaymentIntentHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { userId, bundleId } = req.body;
			
			if (!userId) throw new BasicError('missing userId', 409);
			if (!bundleId) throw new BasicError('missing bundleId', 409);

			const bundle = rolltopiaBundles[bundleId];
			if (!bundle) throw new BasicError('invalid bundleId', 409);

			createPaymentIntent(userId, bundle)
				.then((intent) => resolve(res.status(200).json(intent)))
				.catch(handleError);
		} catch(e:any) {
			handleError(e);
		}
	})
}

export async function createPaymentIntent(userId: string, bundle: RolltopiaBundle): Promise<any> {
	const paymentIntentParams = {
	  	amount: bundle.price * 100,
	  	currency: 'usd',
	  	automatic_payment_methods: { enabled: true }, // default true
		// payment_method_types: ['card'], // defaults to payment methods in set in stripe dashboard
	  	statement_descriptor: `${bundle.quantity} Coins`, // max length + prefix (stripe dashboard) = 22
		metadata: createBundleMetadata(userId, bundle),
	};

	const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
	// await dbInvoices.insertOne({ paymentIntentId: paymentIntent.id, bundle: props.bundle, completed: false });

	return paymentIntent;
}