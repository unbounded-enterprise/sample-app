import { NextApiRequest, NextApiResponse } from "next/types";
import { errorHandling } from '../validate';
import { BasicError } from 'src/types/error';
import { MongoClient } from 'mongodb';
import { assetlayer } from "../app/info";
import { rolltopiaCurrencyId } from "../stripe/paymentIntentWebhook";

const mdb = new MongoClient(process.env.MONGO_ENDPOINT || "");
const dbInvoices = mdb.db('rolltopia').collection('invoices');

export default function paymentWebhookHandler(req:NextApiRequest, res:NextApiResponse) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const { appSecret, paymentRequestId } = req.body;
      const { userId, quantity } = req.body.customParameters;

      if (appSecret !== process.env.HANDCASH_APP_SECRET) throw new BasicError('invalid app secret', 409);

      handlePaymentWebhook(paymentRequestId, userId, quantity)
        .then(() => resolve(res.status(200).end()))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}

async function handlePaymentWebhook(paymentId: string, userId: string, quantity: string) {
  await assetlayer.currencies.increaseCurrencyBalance({ 
    currencyId: rolltopiaCurrencyId, 
    amount: Number(quantity), 
    userId: userId 
  });
  
  await dbInvoices.updateOne({ paymentRequestId: paymentId }, { $set: { completed: true } });
}