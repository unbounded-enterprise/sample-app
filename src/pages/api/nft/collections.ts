import axios from "axios";
import { BasicError } from "src/types/error";
import { GetNFTCollectionsProps } from "src/types/nft";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsCollectionsHandler(req:any, res:any) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { collectionIds, idOnly, countsOnly } = req.body;

            if (!collectionIds || !collectionIds[0]) throw new BasicError('wrong input', 409);
            
            getSessionUser(req, res)
                .then((user) => getNFTsCollections({ handle: user.handle, collectionIds, idOnly, countsOnly }))
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

async function getNFTsCollections(props:GetNFTCollectionsProps) {
    const response = await axios.get('https://api.assetlayer.com/api/v1/nft/collections', { 
        data: props, 
        headers },
    );

    return response.data.body;
}