import { NextApiRequest, NextApiResponse } from "next/types";
import { errorHandling } from '../validate';
import { BasicError } from 'src/types/error';
import axios from "axios";
import { RolltopiaBundle } from "src/types/shop";
import { createBundleMetadata, rolltopiaBundles } from "../stripe/createPaymentIntent";
import { MongoClient } from 'mongodb';

const mdb = new MongoClient(process.env.MONGO_ENDPOINT || "");
const dbInvoices = mdb.db('rolltopia').collection('invoices');

function getPaymentProps(userId: string, bundle: RolltopiaBundle) {
  return {
    method: 'POST',
    url: 'https://cloud.handcash.io/v2/paymentRequests',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'app-secret': process.env.HANDCASH_APP_SECRET,
      'app-id': process.env.HANDCASH_APP_ID
    },
    data: {
      product: {
        name: 'Rolltopia',
        description: 'Let the good times roll.',
        imageUrl: 'https://www.rolltopia.games/static/explorerImage.png'
      },
      receivers: [
        { sendAmount: bundle.price, currencyCode: 'USD', destination: 'dubby' }
      ],
      requestedUserData: ['paymail'],
      notifications: {
        webhook: {
          customParameters: createBundleMetadata(userId, bundle),
          webhookUrl: 'https://www.rolltopia.games/api/handcash/paymentWebhook'
        },
        email: 'jordan@assetlayer.com'
      },
      expirationType: 'never',
      redirectUrl: 'https://www.rolltopia.games'
    }
  };
}

export default function createPaymentHandler(req:NextApiRequest, res:NextApiResponse) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const { userId, bundleId } = req.body;

      if (!userId) throw new BasicError('missing userId', 409);
			else if (!bundleId) throw new BasicError('missing bundleId', 409);

			const bundle = rolltopiaBundles[bundleId];
			if (!bundle) throw new BasicError('invalid bundleId', 409);

      const paymentProps = getPaymentProps(userId, bundle);
      
      createPayment(paymentProps, bundle)
        .then((response) => resolve(res.status(200).json(response)))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}

export async function createPayment(options: any, bundle: RolltopiaBundle) { 
  const response = await axios.request(options);

  await dbInvoices.insertOne({ paymentRequestId: response.data.id, bundle, completed: false });

  return response.data;
}