import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { BasicError } from "src/types/error";
import { GetUserSlotsAssetsProps } from "src/types/asset";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";
import { assetlayerDidToken } from "../user/register";

export default function getAssetSlotsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { didtoken } = req.headers;

            const { idOnly, countsOnly } = { ...req.body, ...req.query } as GetUserSlotsAssetsProps;
                let slotIds = req.query.slotIds || req.query['slotIds[]'] || req.body.slotIds;
                console.log(slotIds);

                if (slotIds && !Array.isArray(slotIds)) {
                    if (slotIds.includes(', ')) slotIds = slotIds.split(', ');
                    else slotIds = [slotIds];
                }

            if (!didtoken || Array.isArray(didtoken)) throw new BasicError('missing didtoken', 409);
            if (!slotIds || !slotIds[0]) throw new BasicError('wrong input', 409);
            
            assetlayerDidToken.assets.raw.getUserSlotsAssets({ slotIds, idOnly, countsOnly}, { didtoken })
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}
