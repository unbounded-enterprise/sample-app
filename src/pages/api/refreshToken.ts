import { getAccount, getProfile } from "./handcash/getProfile";
import { getTokenFromProfile } from "./handcash/getToken";
import { parseError } from "./validate";

export default function refreshTokenHandler(req:any, res:any) {
    return new Promise((resolve, reject)=>{
        const errorHandling = (e:any)=>{
            const err = parseError(e);
            console.log(err?.message);
            return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
        }

        try {
            const handcashToken = req.headers.handcashtoken;

            if (!handcashToken) reject('no handcash token');

            getAccount(handcashToken)
                .then(getProfile)
                .then(getTokenFromProfile)
                .then(token => resolve(res.status(200).json(token)))
                .catch(errorHandling)
        } catch(e:any) {
            errorHandling(e);
        }
    })
    
  }