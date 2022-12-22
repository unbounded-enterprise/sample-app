import axios from "axios";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionNFTsHandler(req:any, res:any) {
  try {
    return new Promise((resolve, reject)=>{
        const errorHandling = (err:any)=>{
            const e = parseError(err);
            console.log('get Nfts error: ', e.message);
            if(e.custom === '401') {
                resolve(res.status(401).json({error: e.message}));
            }
            resolve(res.status(e.custom?parseInt(e.custom):500).json({error: e.message}));
        }
      try {
          const  { token, collectionId, idOnly, from, to } = req.body;
          if ( !token || !collectionId || token === '') {
              resolve(res.status(409).json('wrong input'));
          }
          getCollectionNFTs(token, collectionId, idOnly, from, to).then((nfts:any[])=>{
              resolve(res.status(200).json(nfts));
          }).catch(errorHandling)
      } catch(e:any) {
         errorHandling(e);
      }
  })
  } catch(e:any) {
      res.status(500);
  }
  }

  async function getCollectionNFTs(token: string, collectionId: string, idOnly:boolean = false, from:number = 0, to: number= 9999999) {
    const user = await validateToken(token);
    if (!user || !user.id) {
        return [];
    }
    const body: any = { collectionId, idOnly, handle: user.id };
    if(to) {
        body.serials = `${from}-${to}`;
    }
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/collection/nfts', { 
        data: body, 
        headers },
    );
    const collections = collectionsResponse.data.body.collection.nfts;

    return collections;
  }