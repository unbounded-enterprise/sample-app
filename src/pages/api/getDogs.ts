import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from "src/types/error";
import { getCollectionNFTs } from "./collection/assets";
import { errorHandling } from "./validate";

const dogCollectionId = process.env.DOG_COLLECTION_ID;

export default function getDogsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e) => errorHandling(e, resolve, res);

        try {
            const  { serials, from, to } = req.body;

            if (!serials && (isNaN(from) || isNaN(to))) throw new BasicError('Invalid Serial Range', 409);
    
            getDogSlice(serials || `${from}-${to}`)
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
        } catch(e) {
            handleError(e);
        }
    })
}

async function getDogSlice(serials, idOnly = false) {
    const nfts = await getCollectionNFTs({ collectionId: dogCollectionId, serials, idOnly });
    
    return nfts;
}