import { CustomError } from "../../types/error";
import { User } from "../../types/user";
import jwt from 'jsonwebtoken';
import { decryptAuthToken } from "./handcash/getToken";
import { parseError, validateTokenT } from "./validate";

const { HandCashConnect } = require('@handcash/handcash-connect');

const handCashConnect = new HandCashConnect({
appId: String(process.env.ASSETLAYER_HANDCASH_APPID),
appSecret: String(process.env.ASSETLAYER_HANDCASH_SECRET),
});

const crypto = require('crypto');

interface Payment {
    destination: string;
    amount: number;
    currencyCode: 'USD';
}

interface PaymentProps {
    payments: Payment[];
    description: string;
}

async function pay(authToken:string, paymentProps:PaymentProps) {
    const account = handCashConnect.getAccountFromAuthToken(authToken);

    const paymentResult = await account.wallet.pay(paymentProps);

    return paymentResult;
}

export default function payHandler(req:any, res:any) {
    return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}

        try {
            const { accesstoken, cookie, pin, ['x-forwarded-for']:ip } = req.headers;

            let userHandle = '';

            validateTokenT(accesstoken)
                .then(({ handle, pld }) => {
                    userHandle = handle;
                    return decryptAuthToken(pld, { handle, cookie, pin, ip });
                })
                .then((authToken) => {
                    const payments:Payment[] = [
                        { destination: userHandle, amount: 0.001, currencyCode: 'USD' }
                    ];
                    return pay(authToken, { payments, description: 'Payment Test' });
                })
                .then((data)=>{
                    resolve(res.status(200).json(data));
                })
                .catch(errorHandling);
        } catch(e:any) {
            errorHandling(e);
        }
    })
    
}