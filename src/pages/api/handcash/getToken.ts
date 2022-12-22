import { User } from "src/types/user";
import jwt from 'jsonwebtoken';
import { getAccount, getProfile, getUser } from "./getProfile";
import { parseError } from "../validate";

export function getToken(user:User):string {
  const token = jwt.sign(user, String(process.env.JWT_SECRET));
  return token;
}

export function getTokenFromProfile(profile:any) {
  const user = getUser(profile);
  const token = getToken(user);
  return token;
}

export default function getHandcashTokenHandler(req:any, res:any) {
  return new Promise((resolve, reject)=>{
		const errorHandling = (e:any)=>{
			const err = parseError(e);
			console.log(err?.message);
			return resolve(res.status(parseInt(err?.custom || '500')).json({ error: err?.message }));
		}
    
    try {
      const handcashToken = req.headers.handcashtoken;

      if (!handcashToken) return resolve(res.status(401).json('no handcash token'));
      
      getAccount(handcashToken)
        .then(account => getProfile(account, false))
        .then((profile:any)=>{
          const token = getTokenFromProfile(profile);
          resolve(res.status(200).json(token));
        })
        .catch(errorHandling);
    } catch(e:any) {
      errorHandling(e);
    }
  })
}