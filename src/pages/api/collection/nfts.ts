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
            const  { collectionId, idOnly, serials, from, to } = req.body;

            if (!req.body.collectionId) throw new BasicError('missing collectionId', 409);
            if (!serials && from && to) req.body.serials = `${from}-${to}`;
            if (from) delete req.body.from;
            if (to) delete req.body.to;
            
            getCollectionNFTs(req.body)
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function getCollectionNFTs(props:GetCollectionNftsProps) {
    const response = await axios.get('https://api.assetlayer.com/api/v1/collection/nfts', { 
        data: props, 
        headers },
    );

    return response.data.body;
}