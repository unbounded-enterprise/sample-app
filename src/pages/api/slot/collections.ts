import axios from "axios";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionsHandler(req:any, res:any) {
  try {
    return new Promise((resolve, reject)=>{
        const errorHandling = (err:any)=>{
            const e = parseError(err);
            console.log('get Collection error: ', e.message);
            if(e.custom === '401') {
                resolve(res.status(401).json({error: e.message}));
            }
            resolve(res.status(e.custom?parseInt(e.custom):500).json({error: e.message}));
        }
      try {
          const  { token, slotId } = req.body;
          if ( !token || !slotId || slotId === '' || token === '') {
              resolve(res.status(409).json('wrong input'));
          }
          getCollections(token, slotId).then((collections:any[])=>{
              resolve(res.status(200).json(collections));
          }).catch(errorHandling)
      } catch(e:any) {
         errorHandling(e);
      }
  })
  } catch(e:any) {
      res.status(500);
  }
  }

  async function getCollections(token: string, slotId: string) {
    const user = await validateToken(token);
    if (!user || !user.handle) {
        return [];
    }
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/slot/collections', { 
        data: { slotId, idOnly: false, includeDeactivated: true, handle: user.handle }, 
        headers },
    );
    const collections = collectionsResponse.data.body.slot.collections;

    return collections;
  }