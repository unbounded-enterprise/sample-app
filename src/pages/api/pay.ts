import { NextApiRequest, NextApiResponse } from "next/types";
import { decryptAuthToken } from "./handcash/getToken";
import { parseBasicError, validateTokenT } from "./validate";
import { handCashConnect } from "./handcash/getProfile";
import { BasicError } from "src/types/error";

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

export default function payHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject)=>{
		const errorHandling = (error:any)=>{
			const e = parseBasicError(error);
			console.log(e.message);
			return resolve(res.status(e.status).json({ error: e.message }));
		}

        try {
            const { accesstoken, cookie, pin, ['x-forwarded-for']:ip } = req.headers;
            let userHandle = '';

            if (!accesstoken) throw new BasicError('no access token', 409);
            else if (typeof accesstoken !== 'string') throw new BasicError('malformed access token', 409);

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