import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from 'src/types/error';
import { User } from 'src/types/user';
import { rk } from 'src/utils/random-key';
import { errorHandling, parseError } from '../validate';

const { HandCashConnect } = require('@handcash/handcash-connect');
export const handCashConnect = new HandCashConnect({
  appId: String(process.env.HANDCASH_APP_APPID),
  appSecret: String(process.env.HANDCASH_APP_SECRET),
});

export default function getHandcashProfile(req:NextApiRequest, res:NextApiResponse) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const handcashtoken = req.headers.handcashtoken;

      if (!handcashtoken) throw new BasicError('no handcash token', 409);
      else if (typeof handcashtoken !== 'string') throw new BasicError('malformed handcash token', 409);
      
      getAccount(handcashtoken)
        .then(getProfile)
        .then((profile) => resolve(res.status(200).json(profile)))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
    }
  })
}

export async function getAccount(token: string):Promise<any> {
  try {
    const account = handCashConnect.getAccountFromAuthToken(token);
    
    return account;
  } catch(e:any) {
    throw parseError(e);
  }
}

export async function getProfile(account: any, publicOnly: boolean = true):Promise<any> { 
  try {
    const profile = await account.profile.getCurrentProfile();

    return (publicOnly) ? profile.publicProfile : profile;
  } catch(e:any) {
    throw parseError(e);
  }
}

export function getUser(profile: any):User { 
  try {
    const handle = profile.publicProfile.handle.toLowerCase();

    const user:User = {
      id: rk(),
      handle,
      displayName: profile.publicProfile.displayName,
      email: profile.privateProfile.email || '',
      avatarUrl: profile.publicProfile.avatarUrl,
      exp: new Date().getTime() + 3 * 3600 * 1000, // 3 hour valid 
      iat: new Date().getTime(),
    };

    return user;
  } catch(e:any) {
    throw parseError(e);
  }
}