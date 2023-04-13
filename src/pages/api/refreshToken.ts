import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from "src/types/error";
import { getAccount, getProfile } from "./handcash/getProfile";
import { getTokenFromProfile } from "./handcash/getToken";
import { parseError } from "./validate";

export default function refreshTokenHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject)=>{
        const errorHandling = (e:any)=>{
            const err = parseError(e);
            console.log(err?.message);
            return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
        }

        try {
            const handcashtoken = req.headers.handcashtoken;

            if (!handcashtoken) throw new BasicError('no handcash token', 409);
            else if (typeof handcashtoken !== 'string') throw new BasicError('malformed handcash token', 409);

            getAccount(handcashtoken)
                .then(getProfile)
                .then(getTokenFromProfile)
                .then(token => resolve(res.status(200).json(token)))
                .catch(errorHandling)
        } catch(e:any) {
            errorHandling(e);
        }
    })
    
  }