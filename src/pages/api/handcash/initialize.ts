import { getProfile, getAccount } from './getProfile';
import { getTokenFromProfile } from './getToken';
import { getFriends } from './getFriends';
import { errorHandling, parseError } from '../validate';
import { BasicError } from 'src/types/error';


export default function initializationHandler(req:any, res:any) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const handcashToken = req.headers.handcashtoken;

      if (!handcashToken) throw new BasicError('no handcash token', 409);
        
      getAccount(handcashToken)
        .then((account)=>{
          return Promise.all([getProfile(account, false), getFriends(account)]);
        })
        .then(([profile, friends]) => {
          const accessToken = getTokenFromProfile(profile);

          resolve(res.status(200).json({ accessToken, profile: profile.publicProfile, friends }));
        })
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}