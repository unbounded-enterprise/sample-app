import { getProfile, getAccount } from './getProfile';
import { getTokenFromProfile } from './getToken';
import { getFriends } from './getFriends';
import { parseError } from '../validate';


export default function initializationHandler(req:any, res:any) {
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
        .then((account:any)=>{
          return Promise.all([getProfile(account, false), getFriends(account)]);
        })
        .then(([profile, friends]) => {
          const accessToken = getTokenFromProfile(profile);
          resolve(res.status(200).json({ accessToken, profile: profile.publicProfile, friends }));
        })
        .catch(errorHandling);
    } catch(e:any) {
      errorHandling(e);
    }
  })
}