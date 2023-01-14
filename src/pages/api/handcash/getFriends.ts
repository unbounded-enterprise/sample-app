import { getAccount } from './getProfile';
import { errorHandling, parseError } from '../validate';
import { BasicError } from 'src/types/error';

export default function getHandcashFriends(req:any, res:any) {
  return new Promise((resolve, reject)=>{
		const handleError = (e:any) => errorHandling(e, resolve, res);

    try {
      const handcashToken = req.headers.handcashtoken;

      if (!handcashToken) throw new BasicError('no handcash token', 409);
      
      getAccount(handcashToken)
        .then(getFriends)
        .then((friends) => resolve(res.status(200).json(friends)))
        .catch(handleError);
    } catch(e:any) {
      handleError(e);
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