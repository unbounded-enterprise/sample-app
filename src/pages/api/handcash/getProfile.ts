import { CustomError } from 'src/types/error';
import { User } from 'src/types/user';
import { rk } from 'src/utils/random-key';
import { parseError } from '../validate';

const { HandCashConnect } = require('@handcash/handcash-connect');

const handCashConnect = new HandCashConnect({
  appId: String(process.env.ASSETLAYER_HANDCASH_APPID),
  appSecret: String(process.env.ASSETLAYER_HANDCASH_SECRET),
});

export default function getHandcashProfile(req:any, res:any) {
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
        .then(getProfile)
        .then((profile:any)=>{
          resolve(res.status(200).json(profile));
        })
        .catch(errorHandling);
    } catch(e:any) {
      errorHandling(e);
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