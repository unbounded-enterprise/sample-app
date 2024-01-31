import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from "src/types/error";
import { GetAssetInfoProps } from "src/types/asset";
import { errorHandling } from "../validate";
import { assetlayer } from "../app/info";


export default function getAssetsHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);


		try {
			const { assetId } = { ...req.body, ...req.query } as GetAssetInfoProps;
			let assetIds = req.query.assetIds || req.query['assetIds[]'] || req.body.assetIds;
			
			if (assetIds && !Array.isArray(assetIds)) {
				if (assetIds.includes(', ')) assetIds = assetIds.split(', ');
				else assetIds = [assetIds];
			}
            console.log("assetIds:", assetIds);
			if (!(assetId || assetIds)) throw new BasicError('missing assetId(s)', 409);
			
			assetlayer.assets.raw.info({ assetId, assetIds })
				.then((response) => resolve(res.status(200).json(response)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}
