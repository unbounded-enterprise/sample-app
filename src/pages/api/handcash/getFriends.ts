import { getAccount } from './getProfile';
import { parseError } from '../validate';

export default function getHandcashFriends(req:any, res:any) {
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
        .then(getFriends)
        .then((friends:any)=>{
          resolve(res.status(200).json(friends));
        })
        .catch(errorHandling);
    } catch(e:any) {
      errorHandling(e);
    }
  })
}

export async function getFriends(account: any) { 
  try {
    const friends = await account.profile.getFriends();

    return friends;
  } catch(e:any) {
    throw parseError(e);
  }
}