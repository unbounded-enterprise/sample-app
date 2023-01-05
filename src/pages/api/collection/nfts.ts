import axios from "axios";
import { GetCollectionNftsProps } from "src/types/collection";
import { parseError, validateTokenT } from "../validate";

const headers = { appsecret: String(process.env.APP_SECRET) };

export default function getCollectionNFTsHandler(req:any, res:any) {
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

            if (!token || !collectionId) resolve(res.status(409).json('wrong input'));

            const serials = req.body.serials || (from && to) ? `${from}-${to}` : '';
            
            validateTokenT(token)
                .then(async (user) => {
                    return await getCollectionNFTs({ collectionId, serials, idOnly })
                })
                .then((nfts:any[])=>{
                    resolve(res.status(200).json(nfts));
                })
                .catch(errorHandling)
        } catch(e:any) {
            errorHandling(e);
        }
    })
}

export async function getCollectionNFTs(props:GetCollectionNftsProps) {
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/collection/nfts', { 
        data: props, 
        headers },
    );
    const collections = collectionsResponse.data.body.collection.nfts;

    return collections;
}