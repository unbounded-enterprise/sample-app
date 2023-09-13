import { NextApiRequest, NextApiResponse } from "next/types";
import { getAccount } from './getProfile';
import { errorHandling, parseError } from '../validate';
import { BasicError } from 'src/types/error';
import axios from "axios";

function getPaymentProps(userId: string, bundleId: number, price: number) {
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
        { sendAmount: price, currencyCode: 'USD', destination: 'dubby' }
      ],
      requestedUserData: ['paymail'],
      notifications: {
        webhook: {
          customParameters: { userId, bundleId },
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
      const { userId, bundleId, price } = req.body;
      console.log(userId, bundleId, price)

      if (!userId) throw new BasicError('missing userId', 409);
      else if (!bundleId && bundleId !== 0) throw new BasicError('missing bundleId', 409);
      else if (!price) throw new BasicError('missing price', 409);

      const paymentProps = getPaymentProps(userId, bundleId, price);
      
      createPayment(paymentProps)
        .then((response) => resolve(res.status(200).json(response)))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}

export async function createPayment(options: any) { 
  const response = await axios.request(options);

  return response.data;
}