import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { GetUserCollectionsAssetsProps } from "src/types/asset";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";
import { assetlayerDidToken } from "../user/register";

export default function getAssetCollectionsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { didtoken } = req.headers;

            const { idOnly, countsOnly } = { ...req.body, ...req.query } as GetUserCollectionsAssetsProps;
                let collectionIds = req.query.collectionIds || req.query['collectionIds[]'] || req.body.collectionIds;
                console.log(collectionIds);

                if (collectionIds && !Array.isArray(collectionIds)) {
                    if (collectionIds.includes(', ')) collectionIds = collectionIds.split(', ');
                    else collectionIds = [collectionIds];
                }

            if (!didtoken || Array.isArray(didtoken)) throw new BasicError('missing didtoken', 409);
            if (!collectionIds || !collectionIds[0]) throw new BasicError('wrong input', 409);
            
            assetlayerDidToken.assets.raw.getUserCollectionsAssets({ collectionIds, idOnly, countsOnly}, { didtoken })
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}