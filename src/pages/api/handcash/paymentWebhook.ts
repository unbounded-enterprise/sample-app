import { NextApiRequest, NextApiResponse } from "next/types";
import { getAccount } from './getProfile';
import { errorHandling, parseError } from '../validate';
import { BasicError } from 'src/types/error';
import axios from "axios";

export default function paymentWebhookHandler(req:NextApiRequest, res:NextApiResponse) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      
      resolve(res.status(200).json({}))
    } catch(e:any) {
      handleError(e);
    }
  })
}