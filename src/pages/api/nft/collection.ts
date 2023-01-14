import axios from "axios";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsCollectionHandler(req:any, res:any) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { collectionId, idOnly, countsOnly } = req.body;

            if (!collectionId) resolve(res.status(409).json('wrong input'));
            
            getSessionUser(req, res)
                .then((user) => ({ handle: user.handle, collectionId, idOnly, countsOnly }))
                .then(getNFTsCollection)
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}


interface getNFTsProps {
    handle: string;
    collectionId: string;
    idOnly?: boolean;
    countsOnly?: boolean;
}

async function getNFTsCollection(props:getNFTsProps) {
    const collectionsResponse = await axios.get('https://api.assetlayer.com/api/v1/nft/collection', { 
        data: props, 
        headers },
    );
    const collections = collectionsResponse.data.body.nfts;

    return collections;
}