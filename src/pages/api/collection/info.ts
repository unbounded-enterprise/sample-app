import axios from "axios";
import { BasicError } from "src/types/error";
import {GetCollectionProps, GetCollectionsProps} from "src/types/collection";
import Collection from "src/types/collection";
import { errorHandling } from "../validate";
import { getSessionUser } from "../auth/[...nextauth]";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getCollectionHandler(req:any, res:any) {
	return new Promise((resolve, reject) => {
		const handleError = (e:any) => errorHandling(e, resolve, res);

		try {
			const { collectionId, collectionIds } = req.body;

			if (!(collectionId || collectionIds)) throw new BasicError('missing collectionId', 409);
			if (collectionIds) {
				getCollections(req.body)
					.then((collections) => resolve(res.status(200).json(collections)))
					.catch(handleError)
			} else {
			getCollection(req.body)
				.then((collection) => resolve(res.status(200).json(collection)))
				.catch(handleError)
			}
			/*
			getSessionUser(req, res)
				.then((user) => getCollection(collectionId))
				.then((collection) => resolve(res.status(200).json(collection)))
				.catch(handleError)
			*/
		} catch(e:any) {
			handleError(e);
		}
	})
}


export async function getCollection(props:GetCollectionProps): Promise<Collection> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/collection/info', { 
		data: props, 
		headers },
	);
	const collection = response.data.body;

	return collection;
}

export async function getCollections(props:GetCollectionsProps): Promise<Collection[]> {
	const response = await axios.get('https://api.assetlayer.com/api/v1/collection/info', { 
		data: props, 
		headers },
	);
	const collections = response.data.body;

	return collections;
}