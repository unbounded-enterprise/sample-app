import { NextApiRequest, NextApiResponse } from "next/types";
import { GetCollectionAssetsProps } from "src/types/collection";
import { BasicError } from "src/types/error";
import { toNumber } from "src/utils/basic/basic-numbers";
import { errorHandling } from "../validate";
import { assetlayer } from "../app/info";


export default function getCollectionAssetsHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const { from, to, ...bod } = req.body;

            if (!bod.collectionId) throw new BasicError('missing collectionId', 409);
            if (!bod.serials && (to || to === 0)) {
                const [{ result: f }, { result: t }] = [toNumber(from), toNumber(to)];
                
                if ((f !== undefined) && (t !== undefined) && (f >= 0) && (t >= 0) && (f <= t)) {
                    bod.serials = `${f}-${t}`;
                }
            }
            assetlayer.collections.raw.getCollectionAssets(bod)
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function getCollectionAssets(props:GetCollectionAssetsProps) {
    return await assetlayer.collections.getCollectionAssets(props);

}