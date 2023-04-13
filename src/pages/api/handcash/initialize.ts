import { NextApiRequest, NextApiResponse } from "next/types";
import { getProfile, getAccount } from './getProfile';
import { getTokenFromProfile } from './getToken';
import { getFriends } from './getFriends';
import { errorHandling } from '../validate';
import { BasicError } from 'src/types/error';


export default function initializationHandler(req:NextApiRequest, res:NextApiResponse) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const handcashtoken = req.headers.handcashtoken;

      if (!handcashtoken) throw new BasicError('no handcash token', 409);
      else if (typeof handcashtoken !== 'string') throw new BasicError('malformed handcash token', 409);
        
      getAccount(handcashtoken)
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