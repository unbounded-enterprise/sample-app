import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { CreatePaymentIntentProps } from "src/types/stripe";
import { errorHandling } from "../validate";
import Stripe from 'stripe';
// import { MongoClient } from 'mongodb';
import { RolltopiaBundle } from "src/types/shop";
// import { getUser } from "../user/info";

// const mdb = new MongoClient(process.env.MONGO_ENDPOINT || "");
// const dbInvoices = mdb.db('rolltopia').collection('invoices');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });

function createMetadata(userId: string, bundle: RolltopiaBundle) {
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
			const { userId, bundle } = req.body;
			
			if (!userId) throw new BasicError('missing userId', 409);
			if (!bundle) throw new BasicError('missing bundle', 409);

			createPaymentIntent({ userId, bundle })
				.then((intent) => resolve(res.status(200).json(intent)))
				.catch(handleError);
		} catch(e:any) {
			handleError(e);
		}
	})
}

export async function createPaymentIntent(props:CreatePaymentIntentProps): Promise<any> {
	const paymentIntentParams = {
	  	amount: props.bundle.price * 100,
	  	currency: 'usd',
	  	automatic_payment_methods: { enabled: true }, // default true
		// payment_method_types: ['card'], // defaults to payment methods in set in stripe dashboard
	  	statement_descriptor: `${props.bundle.quantity} Coins`, // max length + prefix (stripe dashboard) = 22
		metadata: createMetadata(props.userId, props.bundle),
	};

	const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
	// await dbInvoices.insertOne({ paymentIntentId: paymentIntent.id, bundle: props.bundle, completed: false });

	return paymentIntent;
}