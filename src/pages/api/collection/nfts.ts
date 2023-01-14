import axios from "axios";
import { GetCollectionNftsProps } from "src/types/collection";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionNFTsHandler(req:any, res:any) {
    return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { collectionId, idOnly, from, to } = req.body;

            if (!collectionId) return resolve(res.status(409).json('missing collectionId'));

            const serials = req.body.serials || (!isNaN(from) && !isNaN(to)) ? `${from}-${to}` : '';

            if (!serials) return resolve(res.status(409).json('missing serials'));
            
            getSessionUser(req, res)
                .then(async (user) => getCollectionNFTs({ collectionId, serials, idOnly }))
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function getCollectionNFTs(props:GetCollectionNftsProps) {
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/collection/nfts', { 
        data: props, 
        headers },
    );
    console.log('coll res: ', collectionsResponse.data.body.collection.nfts);
    const collections = collectionsResponse.data.body.collection.nfts;

    return collections;
}