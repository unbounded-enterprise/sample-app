import { NextApiRequest, NextApiResponse } from "next/types";
import { errorHandling } from '../validate';
import { BasicError } from 'src/types/error';
import axios from "axios";
import { RolltopiaBundle } from "src/types/shop";
import { createBundleMetadata, rolltopiaBundles } from "../stripe/createPaymentIntent";
import { MongoClient } from 'mongodb';

const mdb = new MongoClient(process.env.MONGO_ENDPOINT || "");
const dbInvoices = mdb.db('rolltopia').collection('invoices');

export default function checkPaymentHandler(req:NextApiRequest, res:NextApiResponse) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const { paymentId } = req.body;

      if (!paymentId) throw new BasicError('missing paymentId', 409);
      
      checkPayment(paymentId)
        .then((response) => resolve(res.status(200).json(response)))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}

export async function checkPayment(paymentId: string) { 
  const invoice = await dbInvoices.findOne({ paymentRequestId: paymentId });

  return !!invoice?.completed;
}