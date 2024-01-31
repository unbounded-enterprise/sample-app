import { NextApiRequest, NextApiResponse } from "next/types";
import { BasicError } from "src/types/error";
import { GetCollectionProps } from "src/types/collection";
import { errorHandling } from "../validate";
import { assetlayer } from "../app/info";


export default function getCollectionsHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { collectionId } = { ...req.body, ...req.query } as GetCollectionProps;
			let collectionIds = req.query.collectionIds || req.query['collectionIds[]'] || req.body.collectionIds;
			
			if (collectionIds && !Array.isArray(collectionIds)) {
				if (collectionIds.includes(', ')) collectionIds = collectionIds.split(', ');
				else collectionIds = [collectionIds];
			}

			if (!(collectionId || collectionIds)) throw new BasicError('missing collectionId(s)', 409);
			
			assetlayer.collections.raw.info({ collectionId, collectionIds })
				.then((response) => resolve(res.status(200).json(response)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}

/*export default function getCollectionHandler(req:NextApiRequest, res:NextApiResponse) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { collectionId, collectionIds } = req.body;

			if (!(collectionId || collectionIds)) throw new BasicError('missing collectionId', 409);
			
			assetlayer.collections.raw.info({collectionId})
				.then((body) => resolve(res.status(200).json(body)))
				.catch(handleError)
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getCollection(props:GetCollectionProps) {
	return await assetlayer.collections.info(props);

}*/