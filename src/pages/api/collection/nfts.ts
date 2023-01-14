import axios from "axios";
import { GetCollectionNftsProps } from "src/types/collection";
import { BasicError } from "src/types/error";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionNFTsHandler(req:any, res:any) {
    return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { collectionId, idOnly, serials:bSerials, from, to } = req.body;

            if (!collectionId) throw new BasicError('missing collectionId', 409);
            if (!bSerials && (isNaN(from) || isNaN(to))) throw new BasicError('missing serials', 409);

            const serials = req.body.serials || `${from}-${to}`;
            
            getCollectionNFTs({ collectionId, serials, idOnly })
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)

            /*
            getSessionUser(req, res)
                .then((user) => getCollectionNFTs({ collectionId, serials, idOnly }))
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
            */
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
    const collections = collectionsResponse.data.body.collection.nfts;

    return collections;
}