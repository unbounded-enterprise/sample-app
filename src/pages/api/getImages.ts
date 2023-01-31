import axios from "axios";
import { BasicError } from "src/types/error";
import { getCollectionNFTs } from "./collection/nfts";
import { errorHandling } from "./validate";

const imageCollectionId = process.env.DOG_COLLECTION_ID; // '6351efbc3c5f199ed79d4bc4';  //Blue Bandana collection

export default function getImagesHandler(req, res) {
    return new Promise((resolve, reject) => {
        const handleError = (e) => errorHandling(e, resolve, res);

        try {
            const  { serials, from, to } = req.body;

            if (!serials && (isNaN(from) || isNaN(to))) throw new BasicError('Invalid Serial Range', 409);
    
            getImageSlice(serials || `${from}-${to}`)
                .then((nfts) => resolve(res.status(200).json(nfts)))
                .catch(handleError)
        } catch(e) {
            handleError(e);
        }
    })
}

async function getImageSlice(serials, idOnly = false) {
    const nfts = await getCollectionNFTs({ collectionId: imageCollectionId, serials, idOnly });
    
    return nfts;
}