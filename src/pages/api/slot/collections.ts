import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from "src/types/error";
import { GetCollectionsProps } from "src/types/slot";
import { errorHandling } from "../validate";
import { assetlayer } from "../app/info";


export default function getCollectionsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { slotId, idOnly, includeDeactivated } = req.body;

            if (!slotId) throw new BasicError('missing slotId', 409);

			assetlayer.slots.raw.getSlotCollections({ slotId })
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function getSlotCollections(props:GetCollectionsProps) {
	return await assetlayer.slots.getSlotCollections(props);

}