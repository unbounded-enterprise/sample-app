import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { errorHandling } from "../validate";
import Stripe from 'stripe';
import { MongoClient } from 'mongodb';
import { assetlayer } from "../app/info";
// import { getUser } from "../user/info";

const mdb = new MongoClient(process.env.MONGO_ENDPOINT || "");
const dbInvoices = mdb.db('rolltopia').collection('invoices');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });
const endpointSecret = process.env.PAYMENT_INTENT_WEBHOOK_SECRET;
const rolltopiaCurrencyId = "64f774cb151a6a3dee16df7c";

function getBodyBuffer(req: NextApiRequest) {
	return new Promise((resolve, reject) => {
		const chunks = [];
	
		req.on('data', (chunk) => {
			chunks.push(chunk);
		});
	
		req.on('end', () => {
			resolve(Buffer.concat(chunks));
		});
	
		req.on('error', reject);
	});
};

export default function paymentIntentWebhookHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			if (!(req.method === 'POST')) throw new BasicError('invalid method', 405);
			const sig = req.headers['stripe-signature'];
			
			// if (!sig) throw new BasicError('missing sig', 409);
			// if (!body) throw new BasicError('missing body', 409);
			
			getBodyBuffer(req)
				.then((body) => handlePaymentIntentWebhook(sig, body))
				.then((data) => resolve(res.status(200).end()))
				.catch(handleError);
		} catch(e:any) {
			handleError(e);
		}
	})
}

export async function handlePaymentIntentWebhook(sig, body) {
	const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
	const paymentIntent = event.data.object as Stripe.PaymentIntent;

	switch (event['type']) {
		case 'payment_intent.succeeded':
		  console.log("Succeeded:", paymentIntent.id);
		  await assetlayer.currencies.increaseCurrencyBalance({ currencyId: rolltopiaCurrencyId, amount: Number(paymentIntent.metadata.quantity) });
		  await dbInvoices.updateOne({ paymentIntentId: paymentIntent.id }, { $set: { completed: true } });
		  break;
		case 'payment_intent.payment_failed':
		  const message = paymentIntent.last_payment_error && paymentIntent.last_payment_error.message;
		  console.log('Failed:', paymentIntent.id, message);
		  break;
	}

	return true;
}

export const config = {
	api: {
	  	bodyParser: false,
	},
};