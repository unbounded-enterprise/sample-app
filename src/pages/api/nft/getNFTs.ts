import axios from "axios";
import { parseError, validateToken } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getNFTsHandler(req:any, res:any) {
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
          const  { token, slots, idOnly } = req.body;
          if ( !token || !slots || !slots[0] || token === '') {
              resolve(res.status(409).json('wrong input'));
          }
          getNFTs(token, slots, idOnly).then((nfts:any[])=>{
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

  async function getNFTs(token: string, slots: string[], idOnly:boolean = false) {
    const user = await validateToken(token);
    if (!user || !user.handle) {
        return [];
    }
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/nft/slots', { 
        data: { slotIds: slots, idOnly, handle: user.handle }, 
        headers },
    );
    const collections = collectionsResponse.data.body.nfts;

    return collections;
  }